/* eslint-disable react-refresh/only-export-components */
import { useRef, useState, useEffect, createContext, useContext } from "react";
import { fetch } from "cross-fetch";

export interface UserSsn {
  id: number;
  ssn: string;
}

export interface UserFicoScore {
  id: number;
  score: number;
}

export interface UserInterestRate {
  ssn: string;
  rate: number;
}

interface FicoScoreInterestRate {
  lowerFicoScore: number;
  upperFicoScore: number;
  interestRate: number;
}

function getRate(ficoScore: number): number {
  const interestRates: FicoScoreInterestRate[] = [
    { lowerFicoScore: 1, upperFicoScore: 100, interestRate: 0.91 },
    { lowerFicoScore: 100, upperFicoScore: 200, interestRate: 0.857 },
    { lowerFicoScore: 200, upperFicoScore: 300, interestRate: 0.732 },
    { lowerFicoScore: 300, upperFicoScore: 400, interestRate: 0.633 },
    { lowerFicoScore: 400, upperFicoScore: 500, interestRate: 0.555 },
    { lowerFicoScore: 500, upperFicoScore: 600, interestRate: 0.489 },
    { lowerFicoScore: 600, upperFicoScore: 700, interestRate: 0.311 },
    { lowerFicoScore: 700, upperFicoScore: 800, interestRate: 0.123 },
  ];

  const interestRate = interestRates.reduce<number | null>(
    (foundRate, rate) => {
      const { lowerFicoScore, upperFicoScore, interestRate } = rate;
      return foundRate != null
        ? foundRate
        : lowerFicoScore <= ficoScore && ficoScore < upperFicoScore
        ? interestRate
        : null;
    },
    null,
  );

  if (interestRate == null) {
    throw new Error("INVALID RATE");
  }
  return interestRate;
}

async function saveToDb(ssn: string, rate: number): Promise<UserInterestRate> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const insert: UserInterestRate = {
        ssn: ssn,
        rate: rate,
      };
      resolve(insert);
    }, 200);
  });
}

function fetchJSON<T>(url: string): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => resolve(data as T));
    }, 1000);
  });
}

export const ficoScoreSortByID = (a: UserFicoScore, b: UserFicoScore): number =>
  a.id - b.id;

async function fetchAllFicoScores(url: string): Promise<UserFicoScore[]> {
  return fetchJSON<UserFicoScore[]>(url).then((data) =>
    data.sort(ficoScoreSortByID)
  );
}

export const ssnSortBySsn = (a: UserSsn, b: UserSsn): number =>
  a.ssn.localeCompare(b.ssn);

async function fetchAllSsns(url: string): Promise<UserSsn[]> {
  return fetchJSON<UserSsn[]>(url).then((data) => data.sort(ssnSortBySsn));
}

export async function getFicoScoreBySsn(
  ssns: UserSsn[],
  scores: UserFicoScore[],
  customerSsn: string
): Promise<UserInterestRate | null> {
  const ssn = ssns.find((ficoSsnI) => ficoSsnI.ssn === customerSsn);
  const score =
    ssn == null
      ? undefined
      : scores.find((ficoScoreI) => ficoScoreI.id === ssn.id);
  if (score == null) {
    return null;
  }

  const rate = getRate(score.score);
  const inserted = await saveToDb(customerSsn, rate);
  return inserted;
}

export const fetchUserSnnAndFicoScore = async (
  ssns: string,
  ficoScores: string
): Promise<{ ssns: UserSsn[]; scores: UserFicoScore[] }> => {
  const values = await Promise.all([
    fetchAllSsns(ssns),
    fetchAllFicoScores(ficoScores),
  ]);

  return Promise.resolve({ ssns: values[0], scores: values[1] });
};

export const useUserCreditContext = () => {
  const [selectedSsn, setSelectedSsn] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ssnFilterRef = useRef<HTMLInputElement>(null);
  const [answer, setAnswer] = useState<UserInterestRate | null>(null);
  const [scores, setScores] = useState<UserFicoScore[]>([]);
  const [ssns, setSsns] = useState<UserSsn[]>([]);
  const [filteredSsns, setFilteredSsns] = useState<UserSsn[]>([]);

  useEffect(() => {
    Promise.all([
      fetchAllSsns("http://localhost/user_ssns.json"),
      fetchAllFicoScores("http://localhost/user_fico_scores.json"),
    ]).then((values) => {
      const [ssns, scores] = values;
      setSsns(ssns);
      setFilteredSsns(ssns);
      setScores(scores);
    });
  }, []);

  return {
    selectedSsn,
    setSelectedSsn,
    inputRef,
    ssnFilterRef,
    answer,
    setAnswer,
    scores,
    setScores,
    ssns,
    setSsns,
    filteredSsns,
    setFilteredSsns,
  };
};

export type UseUserCreditReturn = ReturnType<typeof useUserCreditContext>;

export const USE_USER_CREDIT_DEFAULT: UseUserCreditReturn = {
  selectedSsn: null,
  setSelectedSsn: () => {},
  inputRef: { current: null },
  ssnFilterRef: { current: null },
  answer: null,
  setAnswer: () => {},
  scores: [],
  setScores: () => {},
  ssns: [],
  setSsns: () => {},
  filteredSsns: [],
  setFilteredSsns: () => {},
};

export const UseUserCreditContext = createContext(USE_USER_CREDIT_DEFAULT);

export const UserCreditProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;
  const value = useUserCreditContext();

  return (
    <UseUserCreditContext.Provider value={value}>
      {children}
    </UseUserCreditContext.Provider>
  );
};

export const useUserCredit = () => useContext(UseUserCreditContext);

export const userCreditFindInterestRate = (
  state: UseUserCreditReturn,
  ssn: string
): void => {
  const { ssns, scores, setAnswer, setSelectedSsn } = state;

  if (ssn == null || ssns.length === 0 || scores.length === 0) {
    const issue = "must give ssn, have non-empty ssns, have non-empty scores";
    throw new Error(issue);
  }
  setSelectedSsn(ssn);
  getFicoScoreBySsn(ssns, scores, ssn).then((data) => setAnswer(data));
};

export const userCreditFilterSsns = (
  state: UseUserCreditReturn,
  ssnPattern: string
) => {
  const { ssns, setFilteredSsns } = state;
  if (ssnPattern == null) {
    return;
  }

  setFilteredSsns(ssns.filter((ssnI) => ssnI.ssn.includes(ssnPattern)));
};

const QUESTION2_STYLE: React.CSSProperties = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "repeat(3, 1fr)",
};

export const question2GetDataTestID = (
  dataTestID: Uppercase<string>,
  prefix: string = "QUESTION2"
) => ({
  root: `${prefix}_${dataTestID}`,
  title: `${prefix}_TITLE_${dataTestID}`,
  filterSsn: `${prefix}_FILTER_SSN_${dataTestID}`,
  selectSsn: `${prefix}_SELECT_SSN_${dataTestID}`,
  optionSsnIth: (ith: number) => `${prefix}_OPTION_SSN_${dataTestID}_${ith}`,
  rate: `${prefix}_RATE_${dataTestID}`,
});

export const Question2 = (props?: {
  style?: React.CSSProperties;
  dataTestID?: Uppercase<string>;
}): JSX.Element => {
  const { style = {} } = props ?? {};
  const question2 = useUserCredit();
  const { selectedSsn, answer, filteredSsns } = question2;
  const { root, title, filterSsn, selectSsn, optionSsnIth, rate } =
    question2GetDataTestID(props?.dataTestID ?? "ROOT");

  return (
    <div data-testid={root} style={style}>
      <h3 data-testid={title}>Question 2</h3>
      <div style={QUESTION2_STYLE}>
        <input
          data-testid={filterSsn}
          placeholder="Filtering SSN"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            userCreditFilterSsns(question2, e.target.value)
          }
        ></input>
        <select
          data-testid={selectSsn}
          defaultValue={selectedSsn ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            userCreditFindInterestRate(question2, e.target.value)
          }
        >
          <option data-testid={optionSsnIth(0)} value={""}>
            Please choose one option
          </option>
          {filteredSsns.map(({ ssn }, i) => (
            <option data-testid={optionSsnIth(i + 1)} key={ssn} value={ssn}>
              {ssn}
            </option>
          ))}
        </select>
        <span>
          {"Rate: "}
          <span data-testid={rate}>
            {answer?.rate == null ? null : answer.rate}
          </span>
        </span>
      </div>
    </div>
  );
};
