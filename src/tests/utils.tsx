import {
  phoneBookFormGetDataTestID,
  informationTableGetDataTestID,
} from "../Question1";
// import {
//   fetchUserSnnAndFicoScore,
//   fetchUserSnnAndFicoScore,
//   useUserCredit,
// } from "../Question2";
import { AppProvider } from "../App";
import { render } from "@testing-library/react";
import { exampleGetDataTestID } from "../Example";

export const context = { wrapper: AppProvider };

export const getPhoneBookFormDataTestID = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { getByTestId } = rendered;
  const { root, addUser, firstName, lastName, phoneNumber } =
    phoneBookFormGetDataTestID(dataTestID);

  return {
    root: () => getByTestId(root),
    addUser: () => getByTestId(addUser),
    firstName: () => getByTestId(firstName),
    lastName: () => getByTestId(lastName),
    phoneNumber: () => getByTestId(phoneNumber),
  };
};

export const getInformationTableDataTestID = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { findByTestId } = rendered;
  const { root, rowIth, firstNameIth, lastNameIth, phoneNumberIth } =
    informationTableGetDataTestID(dataTestID);

  return {
    root: () => findByTestId(root),
    rowIth: (i: number) => findByTestId(rowIth(i)),
    firstNameIth: (i: number) => findByTestId(firstNameIth(i)),
    lastNameIth: (i: number) => findByTestId(lastNameIth(i)),
    phoneNumberIth: (i: number) => findByTestId(phoneNumberIth(i)),
  };
};

export const getExampleTestID = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { getByTestId } = rendered;
  const { root, noData, title, message } = exampleGetDataTestID(dataTestID);

  return {
    root: () => getByTestId(root),
    noData: () => getByTestId(noData),
    title: () => getByTestId(title),
    message: () => getByTestId(message),
  };
};
