/* eslint-disable react-refresh/only-export-components */
// brandon hawi
// brain p

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

export const userSubmitUserInfo = (useInfoContext: UseUserContextReturn) => {
  const userInfo = useInfoContext;
  const { firstRef, lastRef, phoneRef, setUserInfos } = userInfo;

  const [firstName, lastName, phoneNumber] = [
    firstRef.current?.value,
    lastRef.current?.value,
    phoneRef.current?.value,
  ];
  if (firstName == null || lastName == null || phoneNumber == null) {
    return;
  }
  const newUserInfo: UserInfo = { firstName, lastName, phoneNumber };
  setUserInfos((prevUserInfos) =>
    [...prevUserInfos, newUserInfo].sort(userSorterByLastName)
  );

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

export function PhoneBookForm(props: { style?: React.CSSProperties }) {
  const { style = {} } = props;
  const userInfo = useUserInfo();
  const { firstRef, lastRef, phoneRef } = userInfo;

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        userSubmitUserInfo(userInfo);
      }}
      style={{ ...form.container, ...style }}
    >
      <label>First name:</label>
      <br />
      <input
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
        ref={phoneRef}
        style={form.inputs}
        className="userPhone"
        name="userPhone"
        type="text"
      />
      <br />
      <input
        style={form.submitBtn}
        className="submitButton"
        type="submit"
        value="Add User"
      />
    </form>
  );
}

export function InformationTable(props: { style?: React.CSSProperties }) {
  const { style = {} } = props;
  const { userInfos } = useUserInfo();

  return (
    <table style={{ ...table.table, ...style }} className="informationTable">
      <thead>
        <tr>
          <th style={table.tableCell}>First name</th>
          <th style={table.tableCell}>Last name</th>
          <th style={table.tableCell}>Phone</th>
        </tr>
      </thead>
      <tbody>
        {userInfos.map(({ firstName, lastName, phoneNumber }, i) => (
          <tr key={i}>
            <td style={table.tableCell}>{firstName}</td>
            <td style={table.tableCell}>{lastName}</td>
            <td style={table.tableCell}>{phoneNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Question1() {
  return (
    <div>
      <h3>Question 1</h3>
      <PhoneBookForm />
      <InformationTable />
    </div>
  );
}
