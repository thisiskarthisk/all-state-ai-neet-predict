import { getAuthorityForState } from '@/lib/ai/counsellingAuthorities';
import { INDIAN_STATES } from '@/constants';

export interface MasterCollegeData {
  "College Name": string;
  "ID"?: string;
  "City"?: string | null;
  "State"?: string;
  "Type"?: string;
  "Board"?: string | null;
  "Round 1 Gen"?: number | null;
  "Round 1 OBC-NCL"?: number | null;
  "Round 1 SC"?: number | null;
  "Round 1 ST"?: number | null;
  "Round 1 EWS"?: number | null;
  "Round 2 Gen"?: number | null;
  "Round 2 OBC-NCL"?: number | null;
  "Round 2 SC"?: number | null;
  "Round 2 ST"?: number | null;
  "Round 2 EWS"?: number | null;
  "Round 3 Gen"?: number | null;
  "Round 3 OBC-NCL"?: number | null;
  "Round 3 SC"?: number | null;
  "Round 3 ST"?: number | null;
  "Round 3 EWS"?: number | null;
  "Stray Gen"?: number | null;
  "Stray OBC-NCL"?: number | null;
  "Stray SC"?: number | null;
  "Stray ST"?: number | null;
  "Stray EWS"?: number | null;
  "Overall Rank Range (All Rounds)"?: string | null;
  "Overall Rank Range"?: string | null;
  "2026 Total Seats"?: number | null;
  [key: string]: any;
}

export interface CutoffDetail {
  course: string;
  category: string;
  round: string;
  openingRank: number;
  closingRank: number;
  chanceOfAdmission: 'High' | 'Medium' | 'Low';
  estimated?: boolean; // new Add Aug 13
}

export interface PgCourseDetail {
  course_name: string;
  best_chance: 'High' | 'Medium' | 'Low';
  closest_cutoff: number;
  opening_cutoff: number;
  totalSeats: number;
  overallRangeStr?: string;
  cutoffs: CutoffDetail[];
  allRoundCutoffs?: Record<string, Record<string, number | null>>;
  estimated?: boolean; // new Add Aug 13
}

export interface MatchedCollegeResult {
  college_id: string;
  name: string;
  college_name: string;
  course_name?: string;
  state: string;
  city: string;
  collegeType: string;
  board: string;
  officialWebsite: string;
  best_chance: 'High' | 'Medium' | 'Low';
  closest_cutoff: number;
  opening_cutoff: number;
  totalSeats: number;
  overallRangeStr?: string;
  cutoffs: CutoffDetail[];
  allRoundCutoffs?: Record<string, Record<string, number | null>>;
  authorityInfo?: any;
  pg_courses?: PgCourseDetail[];
  estimated?: boolean; // new Add Aug 13
}

export function isStateMatched(collegeStateRaw: string, filterStateRaw: string): boolean {
  if (!collegeStateRaw || !filterStateRaw) return false;
  const colState = collegeStateRaw.toLowerCase().trim();
  const filterState = filterStateRaw.toLowerCase().trim();

  if (colState === filterState) return true;
  if (colState.includes(filterState) || filterState.includes(colState)) return true;

  if (
    (filterState.includes('delhi') && colState.includes('delhi')) ||
    (filterState.includes('andaman') && colState.includes('andaman')) ||
    (filterState.includes('dadra') && colState.includes('dadar')) ||
    (filterState.includes('chhattisgarh') && colState.includes('chattisgarh')) ||
    (filterState.includes('chattisgarh') && colState.includes('chhattisgarh')) ||
    (filterState.includes('jammu') && colState.includes('jammu'))
  ) {
    return true;
  }
  return false;
}

/**
 * Parses numeric min and max rank bounds from string fields like:
 * - "Estimated: 150,000–300,000 AIR" -> { min: 150000, max: 300000 }
 * - "3,961 - 125,637" -> { min: 3961, max: 125637 }
 */
export function parseRankRangeString(str: string | null | undefined): { min: number; max: number } | null {
  if (!str) return null;
  const numbers = str.replace(/,/g, '').match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  if (numbers.length === 1) {
    const val = Math.round(parseFloat(numbers[0]));
    return { min: Math.max(1, Math.floor(val * 0.8)), max: val };
  }
  const min = Math.round(parseFloat(numbers[0]));
  const max = Math.round(parseFloat(numbers[1]));
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

/**
 * Maps category user selection to column key suffixes.
 */
function getCategorySuffix(categoryStr: string): string {
  const cat = (categoryStr || '').toUpperCase();
  if (cat.includes('OBC')) return 'OBC-NCL';
  if (cat.includes('SC')) return 'SC';
  if (cat.includes('ST')) return 'ST';
  if (cat.includes('EWS')) return 'EWS';
  return 'Gen';
}

function categoryCodeToName(catSuffix: string): string {
  if (catSuffix === 'OBC-NCL' || catSuffix === 'OBC') return 'OBC';
  if (catSuffix === 'SC') return 'SC';
  if (catSuffix === 'ST') return 'ST';
  if (catSuffix === 'EWS') return 'EWS';
  return 'General (UR)';
}

/**
 * Deterministically predicts and classifies college matches based on user's rank,
 * category, course, selected states, and selected round using exact cutoff ranges.
 */
export function predictCollegesFromMasterData(
  masterList: MasterCollegeData[],
  studentRank: number,
  categoryStr: string = 'General',
  selectedStates: string[] = [],
  selectedRound: string = 'ALL'
): MatchedCollegeResult[] {
  const results: (MatchedCollegeResult & { rankDiff: number })[] = [];

  const stateFilters = (selectedStates || [])
    .filter(s => s && s !== 'ALL' && s !== 'All India Quota' && s !== 'AI' && s !== 'All India')
    .map(s => {
      const match = INDIAN_STATES.find(st => st.code === s);
      return match ? match.name : s;
    });

  for (const item of masterList) {
    const name = item["College Name"];
    if (!name) continue;

    const state = item.State || 'Karnataka';
    if (stateFilters.length > 0) {
      const stateMatched = stateFilters.some(fs => isStateMatched(state, fs));
      if (!stateMatched) continue;
    }

    // Build complete allRoundCutoffs matrix for the (i) modal
    const allRoundCutoffs: Record<string, Record<string, number | null>> = {
      'Round 1': {
        Gen: item['Round 1 Gen'] ?? null,
        'OBC-NCL': item['Round 1 OBC-NCL'] ?? null,
        SC: item['Round 1 SC'] ?? null,
        ST: item['Round 1 ST'] ?? null,
        EWS: item['Round 1 EWS'] ?? null,
      },
      'Round 2': {
        Gen: item['Round 2 Gen'] ?? null,
        'OBC-NCL': item['Round 2 OBC-NCL'] ?? null,
        SC: item['Round 2 SC'] ?? null,
        ST: item['Round 2 ST'] ?? null,
        EWS: item['Round 2 EWS'] ?? null,
      },
      'Round 3': {
        Gen: item['Round 3 Gen'] ?? null,
        'OBC-NCL': item['Round 3 OBC-NCL'] ?? null,
        SC: item['Round 3 SC'] ?? null,
        ST: item['Round 3 ST'] ?? null,
        EWS: item['Round 3 EWS'] ?? null,
      },
      Stray: {
        Gen: item['Stray Gen'] ?? null,
        'OBC-NCL': item['Stray OBC-NCL'] ?? null,
        SC: item['Stray SC'] ?? null,
        ST: item['Stray ST'] ?? null,
        EWS: item['Stray EWS'] ?? null,
      },
    };

    // Gather all numeric cutoff values present across all rounds and categories
    const allNumericCutoffs: number[] = [];
    const matchingCutoffEntries: CutoffDetail[] = [];

    const rounds = ['Round 1', 'Round 2', 'Round 3', 'Stray'];
    const isAllCats = !categoryStr || categoryStr.toUpperCase() === 'ALL' || categoryStr.toUpperCase() === 'ALL CATEGORIES';
    const selectedCatSuffix = getCategorySuffix(categoryStr);
    const catsToEvaluate = isAllCats ? ['Gen', 'OBC-NCL', 'SC', 'ST', 'EWS'] : [selectedCatSuffix];

    for (const r of rounds) {
      for (const c of catsToEvaluate) {
        const val = item[`${r} ${c}`];
        if (typeof val === 'number' && val > 0) {
          const cutNum = val;
          allNumericCutoffs.push(cutNum);
          matchingCutoffEntries.push({
            course: 'MBBS',
            category: categoryCodeToName(c),
            round: r,
            openingRank: cutNum * 0.8,
            closingRank: cutNum,
            chanceOfAdmission: studentRank <= cutNum ? 'High' : (studentRank <= cutNum * 1.05 ? 'Medium' : 'Low')
          });
        }
      }
    }

    // Also parse Overall Rank Range (All Rounds) and Overall Rank Range
    const rangeAllRounds = parseRankRangeString(item["Overall Rank Range (All Rounds)"]);
    const rangeOverall = parseRankRangeString(item["Overall Rank Range"]);
    const overallRangeStr = item["Overall Rank Range (All Rounds)"] || item["Overall Rank Range"] || null;

    let minCutoff = 0;
    let maxCutoff = 0;

    if (allNumericCutoffs.length > 0) {
      minCutoff = Math.min(...allNumericCutoffs);
      maxCutoff = Math.max(...allNumericCutoffs);
    } else {
      if (rangeAllRounds) {
        minCutoff = rangeAllRounds.min;
        maxCutoff = rangeAllRounds.max;
      } else if (rangeOverall) {
        minCutoff = rangeOverall.min;
        maxCutoff = rangeOverall.max;
      }
    }

    if (isAllCats) {
      if (rangeAllRounds) {
        minCutoff = minCutoff > 0 ? Math.min(minCutoff, rangeAllRounds.min) : rangeAllRounds.min;
        maxCutoff = maxCutoff > 0 ? Math.max(maxCutoff, rangeAllRounds.max) : rangeAllRounds.max;
      }
      if (rangeOverall) {
        minCutoff = minCutoff > 0 ? Math.min(minCutoff, rangeOverall.min) : rangeOverall.min;
        maxCutoff = maxCutoff > 0 ? Math.max(maxCutoff, rangeOverall.max) : rangeOverall.max;
      }
    }

    if (!maxCutoff || maxCutoff <= 0) continue;
    if (!minCutoff || minCutoff <= 0) minCutoff = Math.max(1, Math.floor(maxCutoff * 0.5));

    // Calculate Admission Chance:
    let chance: 'High' | 'Medium' | 'Low' | null = null;

    if (studentRank <= maxCutoff) {
      chance = 'High';
    } else if (studentRank <= maxCutoff + Math.max(6000, Math.round(maxCutoff * 0.05))) {
      chance = 'Medium';
    } else if (studentRank <= maxCutoff + Math.max(15000, Math.round(maxCutoff * 0.10))) {
      chance = 'Low';
    }

    if (!chance) continue;

    // Filter out colleges whose cutoffs are extremely far off for higher ranks
    if (studentRank > 20000 && studentRank > Math.round(maxCutoff * 1.25)) {
      continue;
    }

    const rankDiff = Math.abs(studentRank - maxCutoff);
    const auth = getAuthorityForState(state);
    const officialWebsite = auth?.officialWebsite || 'https://kea.kar.nic.in/';

    results.push({
      college_id: item.ID || `${name.replace(/\s+/g, '-').toLowerCase()}`,
      name,
      college_name: name,
      state: state,
      city: item.City || state,
      collegeType: item.Type || 'Government',
      board: item.Board || 'State Board / University',
      officialWebsite,
      best_chance: chance,
      closest_cutoff: maxCutoff,
      opening_cutoff: minCutoff,
      totalSeats: item["2026 Total Seats"] || 150,
      overallRangeStr: overallRangeStr || undefined,
      cutoffs: matchingCutoffEntries,
      allRoundCutoffs,
      authorityInfo: auth ? {
        authority: auth.authority,
        organization: auth.organization,
        ugPortal: auth.ugPortal,
        pgPortal: auth.pgPortal,
        officialWebsite: auth.officialWebsite,
        registrationPortal: auth.registrationPortal,
        counsellingPortal: auth.counsellingPortal,
        notificationPage: auth.notificationPage,
        quotaType: auth.quotaType,
        notes: auth.notes
      } : null,
      rankDiff,
    });
  }

  const chanceWeight = { High: 1, Medium: 2, Low: 3 };

  results.sort((a, b) => {
    if (chanceWeight[a.best_chance] !== chanceWeight[b.best_chance]) {
      return chanceWeight[a.best_chance] - chanceWeight[b.best_chance];
    }
    return a.rankDiff - b.rankDiff;
  });

  return results.map(({ rankDiff, ...col }) => col);
}

import { getPgMasterCollegeList } from '@/lib/data/allstate/PgMasterCollegeList';

/**
 * Deterministically predicts and classifies PG college matches based on user's rank,
 * category, course (MD, MS, DNB, Diploma, ALL), speciality, selected states, round, and college type using exact cutoff ranges.
 */
export function predictPgCollegesFromMasterData(
  masterList: any[] | undefined,
  studentRank: number,
  categoryStr: string = 'General',
  selectedCourse: string = 'ALL',
  selectedSpeciality: string = 'ALL',
  selectedStates: string[] = [],
  selectedRound: string = 'ALL',
  typeFilter: string = 'ALL'
): MatchedCollegeResult[] {
  const listToUse = masterList && masterList.length > 0 ? masterList : getPgMasterCollegeList();
  const results: (MatchedCollegeResult & { rankDiff: number })[] = [];

  const stateFilters = (selectedStates || [])
    .filter((s) => s && s !== 'ALL' && s !== 'All India Quota' && s !== 'AI' && s !== 'All India')
    .map((s) => {
      const match = INDIAN_STATES.find((st) => st.code === s);
      return match ? match.name : s;
    });

  const getCatKeys = (cat: string) => {
    const c = (cat || '').toUpperCase();
    if (c === 'ALL' || c === 'ALL CATEGORIES') return ['Gen', 'OBC-NCL', 'SC', 'ST', 'EWS'];
    if (c.includes('OBC')) return ['OBC-NCL'];
    if (c.includes('SC')) return ['SC'];
    if (c.includes('ST')) return ['ST'];
    if (c.includes('EWS')) return ['EWS'];
    return ['Gen'];
  };

  const catKeys = getCatKeys(categoryStr);
  const rounds = selectedRound && selectedRound !== 'ALL' ? [selectedRound] : ['Round 1', 'Round 2', 'Round 3', 'Stray'];

  for (const item of listToUse) {
    const name = item['College Name'];
    if (!name) continue;

    const state = item.State || 'Karnataka';
    if (stateFilters.length > 0) {
      const stateMatched = stateFilters.some((fs) => isStateMatched(state, fs));
      if (!stateMatched) continue;
    }

    if (typeFilter && typeFilter !== 'ALL') {
      const colTypeLower = (item.Type || '').toLowerCase();
      if (!colTypeLower.includes(typeFilter.toLowerCase())) continue;
    }

    const cName = item['Course Name'] || '';
    if (selectedCourse && selectedCourse !== 'ALL') {
      const cUpper = selectedCourse.toUpperCase().trim();
      const cNameUpper = cName.toUpperCase().trim();
      if (cUpper === 'MD/MS' || cUpper === 'MD_MS' || cUpper === 'MD-MS' || cUpper === 'MD MS') {
        if (!cNameUpper.includes('MD') && !cNameUpper.includes('M.D.') && !cNameUpper.includes('MS') && !cNameUpper.includes('M.S.')) continue;
      } else if (cUpper === 'MD') {
        if (!cNameUpper.includes('MD') && !cNameUpper.includes('M.D.')) continue;
      } else if (cUpper === 'MS') {
        if (!cNameUpper.includes('MS') && !cNameUpper.includes('M.S.')) continue;
      } else if (cUpper === 'DNB') {
        if (!cNameUpper.includes('DNB')) continue;
      } else if (cUpper === 'DIPLOMA') {
        if (!cNameUpper.includes('DIPLOMA')) continue;
      }
    }

    if (selectedSpeciality && selectedSpeciality !== 'ALL') {
      const specLower = selectedSpeciality.toLowerCase().trim();
      const cNameLower = cName.toLowerCase();

      let matched = cNameLower.includes(specLower);
      if (!matched) {
        if (specLower.includes('anaesthesiology') || specLower.includes('anesthesia')) {
          matched = cNameLower.includes('anaesthes') || cNameLower.includes('anesthes');
        } else if (specLower.includes('obg') || specLower.includes('gynaecology') || specLower.includes('obstetrics')) {
          matched = cNameLower.includes('obg') || cNameLower.includes('gynaec') || cNameLower.includes('obstet');
        } else if (specLower.includes('ortho')) {
          matched = cNameLower.includes('ortho');
        } else if (specLower.includes('paediatric') || specLower.includes('pediatric')) {
          matched = cNameLower.includes('paediatr') || cNameLower.includes('pediatr');
        } else if (specLower.includes('radio')) {
          matched = cNameLower.includes('radio');
        } else if (specLower.includes('dermatology') || specLower.includes('dvl')) {
          matched = cNameLower.includes('dermat') || cNameLower.includes('dvl') || cNameLower.includes('vener');
        } else if (specLower.includes('ent') || specLower.includes('rhinolaryngology')) {
          matched = cNameLower.includes('ent') || cNameLower.includes('rhino');
        }
      }
      if (!matched) continue;
    }

    const matchingCutoffEntries: CutoffDetail[] = [];
    const eligibleCutoffs: number[] = [];
    const eligibleChances: ('High' | 'Medium' | 'Low')[] = [];

    for (const r of rounds) {
      for (const c of catKeys) {
        const val = item[`${r} ${c}`];
        if (typeof val === 'number' && val > 0) {
          const cutNum = val;

          let itemChance: 'High' | 'Medium' | 'Low' | null = null;
          if (studentRank <= cutNum) {
            itemChance = 'High';
          } else if (studentRank <= cutNum + Math.max(1000, Math.round(cutNum * 0.08))) {
            itemChance = 'Medium';
          } else if (studentRank <= cutNum + Math.max(2500, Math.round(cutNum * 0.15))) {
            itemChance = 'Low';
          }

          if (itemChance !== null) {
            eligibleCutoffs.push(cutNum);
            eligibleChances.push(itemChance);
            matchingCutoffEntries.push({
              course: cName,
              category: categoryCodeToName(c),
              round: r,
              openingRank: Math.round(cutNum * 0.8),
              closingRank: cutNum,
              chanceOfAdmission: itemChance,
            });
          }
        }
      }
    }

    // Fallback for colleges with no real round-wise cutoff numbers (mostly Private/Deemed
    // rows): use the estimated "Overall Rank Range (All Rounds)" range set on these rows
    // (see PgMasterCollegeList.json "Estimated" flag) so they can still surface in results,
    // clearly flagged as estimated rather than official cutoffs.
    // new Add Aug 13
    let isEstimatedMatch = false;
    if (eligibleCutoffs.length === 0 && item['Estimated'] === true) {
      const rangeMatch = /^([\d,]+)\s*[–-]\s*([\d,]+)$/.exec(
        String(item['Overall Rank Range (All Rounds)'] || '').trim()
      );
      if (rangeMatch) {
        const lo = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
        const hi = parseInt(rangeMatch[2].replace(/,/g, ''), 10);

        let itemChance: 'High' | 'Medium' | 'Low' | null = null;
        if (studentRank <= lo) {
          itemChance = 'High';
        } else if (studentRank <= hi) {
          itemChance = 'Medium';
        } else if (studentRank <= hi + Math.max(2500, Math.round(hi * 0.15))) {
          itemChance = 'Low';
        }

        if (itemChance !== null) {
          isEstimatedMatch = true;
          eligibleCutoffs.push(hi);
          eligibleChances.push(itemChance);
          matchingCutoffEntries.push({
            course: cName,
            category: 'Estimated',
            round: 'Estimated',
            openingRank: lo,
            closingRank: hi,
            chanceOfAdmission: itemChance,
            estimated: true,
          });
        }
      }
    }
    // new Add Aug 13




    if (eligibleCutoffs.length === 0) continue;

    const chanceRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
    const bestChance = eligibleChances.reduce(
      (best, cur) => (chanceRank[cur] > chanceRank[best] ? cur : best),
      eligibleChances[0]
    );

    // Prioritize cutoffs where student clears with High chance (cutNum >= studentRank)
    const highCutoffs = eligibleCutoffs.filter((c) => c >= studentRank);
    let bestCutoff: number;

    if (highCutoffs.length > 0) {
      // Pick the smallest closing cutoff that student qualifies for
      bestCutoff = Math.min(...highCutoffs);
    } else {
      // If student rank is higher than all cutoffs (Medium/Low reach), pick the highest cutoff
      bestCutoff = Math.max(...eligibleCutoffs);
    }

    const minCutoff = Math.min(...eligibleCutoffs);
    const maxCutoff = Math.max(...eligibleCutoffs);
    const rankDiff = Math.abs(studentRank - bestCutoff);
    const auth = getAuthorityForState(state);
    const officialWebsite = auth?.officialWebsite || 'https://mcc.nic.in/';

    results.push({
      college_id: item.ID || `${name}-${cName}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
      name,
      college_name: name,
      course_name: cName,
      state: state,
      city: item.City || state,
      collegeType: item.Type || 'Govt',
      board: item.Board || 'NBE / NMC',
      officialWebsite,
      best_chance: bestChance,
      closest_cutoff: bestCutoff,
      opening_cutoff: minCutoff,
      totalSeats: item['2026 Total Seats'] || 0,
      overallRangeStr: item['Overall Rank Range (All Rounds)'] || item['Overall Rank Range'] || undefined,
      estimated: isEstimatedMatch, // new Add Aug 13
      cutoffs: matchingCutoffEntries,
      allRoundCutoffs: {
        'Round 1': {
          Gen: item['Round 1 Gen'] ?? null,
          'OBC-NCL': item['Round 1 OBC-NCL'] ?? null,
          SC: item['Round 1 SC'] ?? null,
          ST: item['Round 1 ST'] ?? null,
          EWS: item['Round 1 EWS'] ?? null,
        },
        'Round 2': {
          Gen: item['Round 2 Gen'] ?? null,
          'OBC-NCL': item['Round 2 OBC-NCL'] ?? null,
          SC: item['Round 2 SC'] ?? null,
          ST: item['Round 2 ST'] ?? null,
          EWS: item['Round 2 EWS'] ?? null,
        },
        'Round 3': {
          Gen: item['Round 3 Gen'] ?? null,
          'OBC-NCL': item['Round 3 OBC-NCL'] ?? null,
          SC: item['Round 3 SC'] ?? null,
          ST: item['Round 3 ST'] ?? null,
          EWS: item['Round 3 EWS'] ?? null,
        },
        Stray: {
          Gen: item['Stray Gen'] ?? null,
          'OBC-NCL': item['Stray OBC-NCL'] ?? null,
          SC: item['Stray SC'] ?? null,
          ST: item['Stray ST'] ?? null,
          EWS: item['Stray EWS'] ?? null,
        },
      },
      authorityInfo: auth ? {
        authority: auth.authority,
        organization: auth.organization,
        ugPortal: auth.ugPortal,
        pgPortal: auth.pgPortal,
        officialWebsite: auth.officialWebsite,
        registrationPortal: auth.registrationPortal,
        counsellingPortal: auth.counsellingPortal,
        notificationPage: auth.notificationPage,
        quotaType: auth.quotaType,
        notes: auth.notes
      } : null,
      rankDiff,
    });
  }

  const chanceWeight = { High: 1, Medium: 2, Low: 3 };

  // Group PG course matches by College Name (1 Single Card per College)
  const collegeGroupMap = new Map<string, MatchedCollegeResult & { rankDiff: number }>();

  for (const col of results) {
    const colKey = (col.name || '').toLowerCase().trim();

    if (!collegeGroupMap.has(colKey)) {
      collegeGroupMap.set(colKey, {
        ...col,
        pg_courses: [{
          course_name: col.course_name || '',
          best_chance: col.best_chance,
          closest_cutoff: col.closest_cutoff,
          opening_cutoff: col.opening_cutoff,
          totalSeats: col.totalSeats,
          overallRangeStr: col.overallRangeStr,
          cutoffs: col.cutoffs,
          allRoundCutoffs: col.allRoundCutoffs,
          estimated: col.estimated, // new Add Aug 13
        }]
      });
    } else {
      const existing = collegeGroupMap.get(colKey)!;
      if (!existing.pg_courses) {
        existing.pg_courses = [];
      }

      const courseExists = existing.pg_courses.some(
        (crs) => (crs.course_name || '').toLowerCase().trim() === (col.course_name || '').toLowerCase().trim()
      );

      if (!courseExists) {
        existing.pg_courses.push({
          course_name: col.course_name || '',
          best_chance: col.best_chance,
          closest_cutoff: col.closest_cutoff,
          opening_cutoff: col.opening_cutoff,
          totalSeats: col.totalSeats,
          overallRangeStr: col.overallRangeStr,
          cutoffs: col.cutoffs,
          allRoundCutoffs: col.allRoundCutoffs,
          estimated: col.estimated, // new Add Aug 13
        });
        existing.totalSeats += col.totalSeats;
      }

      // new Add Aug 13
      if (col.estimated) {
        existing.estimated = true;
      }

      if (chanceWeight[col.best_chance] < chanceWeight[existing.best_chance]) {
        existing.best_chance = col.best_chance;
      }
      // Update college-level closest_cutoff to the best (smallest) cutoff >= studentRank
      const curCut = existing.closest_cutoff;
      const newCut = col.closest_cutoff;

      if (newCut >= studentRank) {
        if (curCut < studentRank || newCut < curCut) {
          existing.closest_cutoff = newCut;
        }
      } else if (curCut < studentRank) {
        if (newCut > curCut) {
          existing.closest_cutoff = newCut;
        }
      }
    }
  }

  const deduplicated = Array.from(collegeGroupMap.values());
  deduplicated.sort((a, b) => {
    if (chanceWeight[a.best_chance] !== chanceWeight[b.best_chance]) {
      return chanceWeight[a.best_chance] - chanceWeight[b.best_chance];
    }
    return a.closest_cutoff - b.closest_cutoff;
  });

  return deduplicated.map(({ rankDiff, ...col }) => col);
}
