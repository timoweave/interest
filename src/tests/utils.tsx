import {
  phoneBookFormGetDataTestIDLabel,
  informationTableGetDataTestIDLabel,
} from "../Question1";
import { AppProvider } from "../App";
import { render } from "@testing-library/react";
import { exampleGetDataTestIDLabel } from "../Example";
import { question2GetDataTestIDLabel } from "../Question2";

export const context = { wrapper: AppProvider };

export const phoneBookFormDataTestIDElement = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { getByTestId } = rendered;
  const { root, addUser, firstName, lastName, phoneNumber } =
    phoneBookFormGetDataTestIDLabel(dataTestID);

  return {
    root: () => getByTestId(root),
    addUser: () => getByTestId(addUser),
    firstName: () => getByTestId(firstName),
    lastName: () => getByTestId(lastName),
    phoneNumber: () => getByTestId(phoneNumber),
  };
};

export const informationTableDataTestIDElement = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { findByTestId } = rendered;
  const { root, rowIth, firstNameIth, lastNameIth, phoneNumberIth } =
    informationTableGetDataTestIDLabel(dataTestID);

  return {
    root: () => findByTestId(root),
    rowIth: (i: number) => findByTestId(rowIth(i)),
    firstNameIth: (i: number) => findByTestId(firstNameIth(i)),
    lastNameIth: (i: number) => findByTestId(lastNameIth(i)),
    phoneNumberIth: (i: number) => findByTestId(phoneNumberIth(i)),
  };
};

export const exampleGetDataTestIDElement = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { queryByTestId } = rendered;
  const { root, noData, title, message } =
    exampleGetDataTestIDLabel(dataTestID);

  return {
    root: () => queryByTestId(root),
    noData: () => queryByTestId(noData),
    title: () => queryByTestId(title),
    message: () => queryByTestId(message),
  };
};

export const question2GetDataTestIDElement = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { queryByTestId } = rendered;
  const { root, title, filterSsn, selectSsn, optionSsnIth, rate } =
    question2GetDataTestIDLabel(dataTestID);

  return {
    root: () => queryByTestId(root),
    title: () => queryByTestId(title),
    filterSsn: () => queryByTestId(filterSsn),
    selectSsn: () => queryByTestId(selectSsn),
    optionSsnIth: (ith: number) => queryByTestId(optionSsnIth(ith)),
    rate: () => queryByTestId(rate),
  };
};
