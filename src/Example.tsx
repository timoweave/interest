/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { fetch } from "cross-fetch";

export interface Data {
  title: string;
  message: string;
}

export const useExample = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch("http://localhost/api/data")
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
        console.log({ hello: 123 });
      });
  }, []);

  return {
    data,
    setData,
  };
};

export const exampleGetDataTestID = (dataTestID: Uppercase<string>) => ({
  root: `EXAMPLE_${dataTestID}`,
  title: `EXAMPLE_TITLE`,
  message: `EXAMPLE_MESSAGE`,
  noData: `EXAMPLE_NO_DATA`,
});

export const Example = (props?: {
  style?: React.CSSProperties;
  dataTestID?: Uppercase<string>;
}): JSX.Element => {
  const { style = {} } = props ?? {};
  const { data } = useExample();
  const { root, noData, title, message } = exampleGetDataTestID(
    props?.dataTestID ?? "ROOT"
  );

  return (
    <div data-testid={root} style={style}>
      {data == null ? (
        <div data-testid={noData}>no data fetched</div>
      ) : (
        <div>
          <h3 data-testid={title}>{data.title}</h3>
          <pre data-testid={message}>{data.message}</pre>
        </div>
      )}
    </div>
  );
};
