/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState, useContext, createContext } from "react";

const table: { [key: string]: React.CSSProperties } = {
  table: {
    borderCollapse: "collapse",
  },
  tableCell: {
    border: "1px solid gray",
    margin: 0,
    padding: "5px 10px",
    width: "max-content",
    minWidth: "150px",
  },
};

const form: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    border: "1px solid #F0F8FF",
    borderRadius: "15px",
    width: "max-content",
    marginBottom: "40px",
  },
  inputs: {
    marginBottom: "5px",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "10px 15px",
    border: "none",
    backgroundColor: "lightseagreen",
    fontSize: "14px",
    borderRadius: "5px",
  },
};

export interface UserInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export function useUserContext() {
  const [userInfos, setUserInfos] = useState<UserInfo[]>([]);
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  return {
    userInfos,
    setUserInfos,
    firstRef,
    lastRef,
    phoneRef,
  };
}

export type UseUserContextReturn = ReturnType<typeof useUserContext>;

export const userSorterByLastName = (a: UserInfo, b: UserInfo): number =>
  a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());

export const userAddUserInfoOrderly = (
  newUserInfo: UserInfo,
  useInfoContext: UseUserContextReturn
) => {
  const { setUserInfos } = useInfoContext;
  setUserInfos((prevUserInfos) =>
    [...prevUserInfos, newUserInfo].sort(userSorterByLastName)
  );
};

export const userSubmitUserInfo = (useInfoContext: UseUserContextReturn) => {
  const { firstRef, lastRef, phoneRef } = useInfoContext;

  const [firstName, lastName, phoneNumber] = [
    firstRef.current?.value,
    lastRef.current?.value,
    phoneRef.current?.value,
  ];
  if (firstName == null || lastName == null || phoneNumber == null) {
    return;
  }

  userAddUserInfoOrderly({ firstName, lastName, phoneNumber }, useInfoContext);

  firstRef.current!.value = "";
  lastRef.current!.value = "";
  phoneRef.current!.value = "";
};

export const USER_INFO_DEFAULT: UseUserContextReturn = {
  userInfos: [],
  setUserInfos: () => {},
  firstRef: { current: null },
  lastRef: { current: null },
  phoneRef: { current: null },
};

export const UserContext =
  createContext<UseUserContextReturn>(USER_INFO_DEFAULT);

export const useUserInfo = () => useContext(UserContext);

export const phoneBookFormGetDataTestID = (
  dataTestID: Uppercase<string>,
  prefix: string = "PHONE_BOOK_FORM"
) => ({
  root: `${prefix}_${dataTestID}`,
  addUser: `${prefix}_ADD_USER`,
  firstName: `${prefix}_FIRST_NAME`,
  lastName: `${prefix}_LAST_NAME`,
  phoneNumber: `${prefix}_PHONE_NUMBER`,
});

export function PhoneBookForm(props: {
  style?: React.CSSProperties;
  dataTestID?: Uppercase<string>;
}) {
  const { style = {} } = props;
  const userInfo = useUserInfo();
  const { firstRef, lastRef, phoneRef } = userInfo;
  const { root, firstName, lastName, phoneNumber, addUser } =
    phoneBookFormGetDataTestID(props?.dataTestID ?? "ROOT");

  return (
    <form
      data-testid={root}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        userSubmitUserInfo(userInfo);
      }}
      style={{ ...form.container, ...style }}
    >
      <label>First name:</label>
      <br />
      <input
        data-testid={firstName}
        ref={firstRef}
        style={form.inputs}
        className="userFirstname"
        name="userFirstname"
        type="text"
      />
      <br />
      <label>Last name:</label>
      <br />
      <input
        data-testid={lastName}
        ref={lastRef}
        style={form.inputs}
        className="userLastname"
        name="userLastname"
        type="text"
      />
      <br />
      <label>Phone:</label>
      <br />
      <input
        data-testid={phoneNumber}
        ref={phoneRef}
        style={form.inputs}
        className="userPhone"
        name="userPhone"
        type="text"
      />
      <br />
      <input
        data-testid={addUser}
        style={form.submitBtn}
        className="submitButton"
        type="submit"
        value="Add User"
      />
    </form>
  );
}

export const informationTableGetDataTestID = (
  dataTestID: Uppercase<string>,
  prefix: string = "INFORMATION_TABLE"
) => ({
  root: `${prefix}_${dataTestID}`,
  rowIth: (ith: number) => `${prefix}_SORTED_ROW_${ith}`,
  firstNameIth: (ith: number) => `${prefix}_FIRST_NAME_${ith}`,
  lastNameIth: (ith: number) => `${prefix}_LAST_NAME_${ith}`,
  phoneNumberIth: (ith: number) => `${prefix}_PHONE_NUMBER_${ith}`,
});

export function InformationTable(props: {
  style?: React.CSSProperties;
  dataTestID?: Uppercase<string>;
}) {
  const { style = {} } = props;
  const { userInfos } = useUserInfo();
  const { root, rowIth, firstNameIth, lastNameIth, phoneNumberIth } =
    informationTableGetDataTestID(props?.dataTestID ?? "ROOT");

  return (
    <table
      style={{ ...table.table, ...style }}
      className="informationTable"
      data-testid={root}
    >
      <thead>
        <tr>
          <th style={table.tableCell}>First name</th>
          <th style={table.tableCell}>Last name</th>
          <th style={table.tableCell}>Phone</th>
        </tr>
      </thead>
      <tbody>
        {userInfos.map(({ firstName, lastName, phoneNumber }, i) => (
          <tr key={i} data-testid={rowIth(i)}>
            <td style={table.tableCell} data-testid={firstNameIth(i)}>
              {firstName}
            </td>
            <td style={table.tableCell} data-testid={lastNameIth(i)}>
              {lastName}
            </td>
            <td style={table.tableCell} data-testid={phoneNumberIth(i)}>
              {phoneNumber}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const QUESTION1_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 3fr",
  alignItems: "flex-start",
};

export function Question1(props: { dataTestID?: Uppercase<string> }) {
  const { dataTestID } = props;
  return (
    <div data-testid={dataTestID}>
      <h3>Question 1</h3>
      <div style={QUESTION1_STYLE}>
        <PhoneBookForm
          dataTestID={`${dataTestID}/PHONE` as Uppercase<string>}
        />
        <InformationTable
          dataTestID={`${dataTestID}/INFO` as Uppercase<string>}
        />
      </div>
    </div>
  );
}

export const UserProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const userInfo = useUserContext();
  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
