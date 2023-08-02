import { describe, expect, test } from "vitest";
import {
  UseUserContextReturn,
  useUserContext,
  // UserProvider,
  userSorterByLastName,
  UserInfo,
  Question1,
  // PHONE_BOOK_FORM_DATA_TESTID,
  // INFORMATION_TABLE_DATA_TESTID,
  userAddUserInfoOrderly,
} from "../Question1";

import { act, fireEvent, render, renderHook } from "@testing-library/react";

// const context = { wrapper: UserProvider };

// const getPhoneBookFormDataTestID = (rendered: ReturnType<typeof render>) => {
//   const { getByTestId } = rendered;
//   const { component, addUser, firstName, lastName, phoneNumber } =
//     PHONE_BOOK_FORM_DATA_TESTID;

//   return {
//     component: () => getByTestId(component),
//     addUser: () => getByTestId(addUser),
//     firstName: () => getByTestId(firstName),
//     lastName: () => getByTestId(lastName),
//     phoneNumber: () => getByTestId(phoneNumber),
//   };
// };

// const getInformationTableDataTestID = (rendered: ReturnType<typeof render>) => {
//   const { findByTestId } = rendered;
//   const { component, rowIth, firstNameIth, lastNameIth, phoneNumberIth } =
//     INFORMATION_TABLE_DATA_TESTID;

//   return {
//     component: () => findByTestId(component),
//     rowIth: (i: number) => findByTestId(rowIth(i)),
//     firstNameIth: (i: number) => findByTestId(firstNameIth(i)),
//     lastNameIth: (i: number) => findByTestId(lastNameIth(i)),
//     phoneNumberIth: (i: number) => findByTestId(phoneNumberIth(i)),
//   };
// };

import {
  context,
  getPhoneBookFormDataTestID,
  getInformationTableDataTestID,
} from "./utils";

describe("question 1", () => {
  const peterPan: UserInfo = {
    firstName: "Peter",
    lastName: "Pan",
    phoneNumber: "611",
  };
  const tinkerBell: UserInfo = {
    firstName: "Tinker",
    lastName: "Bell",
    phoneNumber: "211",
  };
  const captainHook: UserInfo = {
    firstName: "Captain",
    lastName: "Hook",
    phoneNumber: "411",
  };

  test("initial is empty", async () => {
    const { result } = renderHook(() => useUserContext(), context);
    const user = (): UseUserContextReturn => result.current;

    expect(user().userInfos).toEqual([]);
    expect(user().firstRef.current).toEqual(null);
    expect(user().lastRef.current).toEqual(null);
    expect(user().phoneRef.current).toEqual(null);
  });

  test("sort two users by last name", () => {
    expect(userSorterByLastName(peterPan, tinkerBell)).toEqual(1);
    expect(userSorterByLastName(peterPan, captainHook)).toEqual(1);
    expect(userSorterByLastName(captainHook, tinkerBell)).toEqual(1);
    expect(userSorterByLastName(tinkerBell, captainHook)).toEqual(-1);
    expect(userSorterByLastName(tinkerBell, tinkerBell)).toEqual(0);
  });

  test("sort three users by last name", () => {
    const { result } = renderHook(() => useUserContext(), context);
    const user = (): UseUserContextReturn => result.current;

    act(() => {
      userAddUserInfoOrderly(peterPan, user());
      userAddUserInfoOrderly(tinkerBell, user());
      userAddUserInfoOrderly(captainHook, user());
    });

    expect(user().userInfos).toEqual([tinkerBell, captainHook, peterPan]);
  });

  test("add tinker bell, and clear input", async () => {
    const rendered = render(<Question1 />, context);
    const phoneBookForm = getPhoneBookFormDataTestID(rendered, "T1");
    const informationTable = getInformationTableDataTestID(rendered, "T2");

    const { firstName, lastName, phoneNumber, addUser } = phoneBookForm;
    const { firstNameIth, lastNameIth, phoneNumberIth } = informationTable;

    fireEvent.change(firstName(), { target: { value: tinkerBell.firstName } });
    fireEvent.change(lastName(), { target: { value: tinkerBell.lastName } });
    fireEvent.change(phoneNumber(), {
      target: { value: tinkerBell.phoneNumber },
    });
    act(() => fireEvent.click(addUser()));

    expect(firstName()).toHaveValue("");
    expect(lastName()).toHaveValue("");
    expect(phoneNumber()).toHaveValue("");

    expect(await firstNameIth(0)).toHaveTextContent("Tinker");
    expect(await lastNameIth(0)).toHaveTextContent("Bell");
    expect(await phoneNumberIth(0)).toHaveTextContent("211");
  });

  test("add peter pan, tinker bell, and clear input", async () => {
    const rendered = render(<Question1 dataTestID="T1" />, context);
    const phoneBookForm = getPhoneBookFormDataTestID(rendered, "T3");
    const informationTable = getInformationTableDataTestID(rendered, "T4");

    const { firstName, lastName, phoneNumber, addUser } = phoneBookForm;
    const { firstNameIth, lastNameIth, phoneNumberIth } = informationTable;

    fireEvent.change(firstName(), { target: { value: peterPan.firstName } });
    fireEvent.change(lastName(), { target: { value: peterPan.lastName } });
    fireEvent.change(phoneNumber(), {
      target: { value: peterPan.phoneNumber },
    });
    act(() => fireEvent.click(addUser()));

    fireEvent.change(firstName(), { target: { value: captainHook.firstName } });
    fireEvent.change(lastName(), { target: { value: captainHook.lastName } });
    fireEvent.change(phoneNumber(), {
      target: { value: captainHook.phoneNumber },
    });
    act(() => fireEvent.click(addUser()));

    fireEvent.change(firstName(), { target: { value: tinkerBell.firstName } });
    fireEvent.change(lastName(), { target: { value: tinkerBell.lastName } });
    fireEvent.change(phoneNumber(), {
      target: { value: tinkerBell.phoneNumber },
    });
    act(() => fireEvent.click(addUser()));

    expect(await firstNameIth(0)).toHaveTextContent(tinkerBell.firstName);
    expect(await lastNameIth(0)).toHaveTextContent(tinkerBell.lastName);
    expect(await phoneNumberIth(0)).toHaveTextContent(tinkerBell.phoneNumber);

    expect(await firstNameIth(1)).toHaveTextContent(captainHook.firstName);
    expect(await lastNameIth(1)).toHaveTextContent(captainHook.lastName);
    expect(await phoneNumberIth(1)).toHaveTextContent(captainHook.phoneNumber);

    expect(await firstNameIth(2)).toHaveTextContent(peterPan.firstName);
    expect(await lastNameIth(2)).toHaveTextContent(peterPan.lastName);
    expect(await phoneNumberIth(2)).toHaveTextContent(peterPan.phoneNumber);
  });
});
