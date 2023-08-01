/* eslint-disable react-refresh/only-export-components */
import { useRef, useState, useEffect } from "react";

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

function getRate(ficoScore: number): number {
  if (ficoScore <= 0) {
    throw new Error("INVALID RATE");
  } else if (1 <= ficoScore && ficoScore < 100) {
    return 0.921;
  } else if (100 <= ficoScore && ficoScore < 200) {
    return 0.857;
  } else if (200 <= ficoScore && ficoScore < 300) {
    return 0.732;
  } else if (300 <= ficoScore && ficoScore < 400) {
    return 0.633;
  } else if (400 <= ficoScore && ficoScore < 500) {
    return 0.555;
  } else if (500 <= ficoScore && ficoScore < 600) {
    return 0.489;
  } else if (600 <= ficoScore && ficoScore < 700) {
    return 0.311;
  } else if (700 <= ficoScore) {
    return 0.123;
  } else {
    throw new Error("INVALID FICO SCORE");
  }
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

function fetchAllFicoScores(): Promise<UserFicoScore[]> {
  return fetchJSON<UserFicoScore[]>("../public/user_fico_scores.json");
}

function fetchAllSsns(): Promise<UserSsn[]> {
  return fetchJSON<UserSsn[]>("../public/user_ssns.json");
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

export const fetchUserSnnAndFicoScore = (props: {
  ssnUrl: string;
  ficoScoreUrl: string;
  setSsns: React.Dispatch<React.SetStateAction<UserSsn[]>>;
  setFilteredSsns: React.Dispatch<React.SetStateAction<UserSsn[]>>;
  setScores: React.Dispatch<React.SetStateAction<UserFicoScore[]>>;
}) => {
  const promises = [fetchAllSsns(), fetchAllFicoScores()];
  Promise.all(promises).then(([fetchedSsns, fetchedScores]) => {
    const { setSsns, setFilteredSsns, setScores } = props;
    setSsns(fetchedSsns as UserSsn[]);
    setFilteredSsns(fetchedSsns as UserSsn[]);
    setScores(fetchedScores as UserFicoScore[]);
  });
};

export const useQuestion2 = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const ssnFilterRef = useRef<HTMLInputElement>(null);
  const [answer, setAnswer] = useState<UserInterestRate | null>(null);
  const [scores, setScores] = useState<UserFicoScore[]>([]);
  const [ssns, setSsns] = useState<UserSsn[]>([]);
  const [filteredSsns, setFilteredSsns] = useState<UserSsn[]>([]);

  useEffect(() => {
    fetchUserSnnAndFicoScore({
      ssnUrl: "../public/user_ssn.json",
      ficoScoreUrl: "../public/user_fico_scores.json",
      setSsns,
      setFilteredSsns,
      setScores,
    });
  }, []);

  return {
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

export type UseQuestion2Return = ReturnType<typeof useQuestion2>;

export const Question2FindInterestRate = (
  state: UseQuestion2Return,
  ssn: string
): void => {
  const { ssns, scores, setAnswer } = state;

  if (ssn == null || ssns.length === 0 || scores.length === 0) {
    const issue = "must give ssn, have non-empty ssns, have non-empty scores";
    throw new Error(issue);
  }

  getFicoScoreBySsn(ssns, scores, ssn).then((data) => setAnswer(data));
};

export const question2FilterSsns = (
  state: UseQuestion2Return,
  ssnPattern: string
) => {
  const { ssns, setFilteredSsns } = state;

  if (ssnPattern == null) {
    return;
  }

  setFilteredSsns(ssns.filter((ssnI) => ssnI.ssn.includes(ssnPattern)));
};

const question2style: React.CSSProperties = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "repeat(3, 1fr)",
};

export const Question2 = (): JSX.Element => {
  const question2 = useQuestion2();
  const { answer, filteredSsns } = question2;

  return (
    <div>
      <h3>Question 2</h3>
      <div style={question2style}>
        <input
          placeholder="Filter SSN"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            question2FilterSsns(question2, e.target.value)
          }
        ></input>
        <select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            Question2FindInterestRate(question2, e.target.value)
          }
        >
          <option value={""}>Please choose one option</option>
          {filteredSsns.map(({ ssn }) => (
            <option key={ssn} value={ssn}>
              {ssn}
            </option>
          ))}
        </select>
        <span>Rate: {answer?.rate == null ? null : answer.rate}</span>
      </div>
    </div>
  );
};
