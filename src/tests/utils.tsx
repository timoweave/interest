import {
  phoneBookFormGetDataTestID,
  informationTableGetDataTestID,
} from "../Question1";
import { AppProvider } from "../App";
import { render } from "@testing-library/react";
import { exampleGetDataTestID } from "../Example";
import { question2GetDataTestID } from "../Question2";

export const context = { wrapper: AppProvider };

export const phoneBookFormDataTestIDFromRender = (
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

export const informationTableDataTestIDFromRender = (
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

export const exampleGetDataTestIDFromRender = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { queryByTestId } = rendered;
  const { root, noData, title, message } = exampleGetDataTestID(dataTestID);

  return {
    root: () => queryByTestId(root),
    noData: () => queryByTestId(noData),
    title: () => queryByTestId(title),
    message: () => queryByTestId(message),
  };
};

export const question2GetDataTestIDFromRender = (
  rendered: ReturnType<typeof render>,
  dataTestID: Uppercase<string>
) => {
  const { queryByTestId } = rendered;
  const { root, title, filterSsn, selectSsn, optionSsnIth, rate } =
    question2GetDataTestID(dataTestID);

  return {
    root: () => queryByTestId(root),
    title: () => queryByTestId(title),
    filterSsn: () => queryByTestId(filterSsn),
    selectSsn: () => queryByTestId(selectSsn),
    optionSsnIth: (ith: number) => queryByTestId(optionSsnIth(ith)),
    rate: () => queryByTestId(rate),
  };
};
