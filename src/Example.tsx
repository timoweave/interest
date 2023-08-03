/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState } from "react";
import { fetch } from "cross-fetch";

export interface Data {
  title: string;
  message: string;
}

export const useExample = (props: { url: string }) => {
  const { url } = props;
  const [data, setData] = useState<Data | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const message = useMemo<string | null>(
    () => (data?.message == null ? null : `${data.message}(generated)`),
    [data?.message]
  );

  useEffect(() => {
    setTitle(data?.title == null ? null : `${data.title}(generated)`);
  }, [data?.title]);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    setData,
    title,
    message,
  };
};

export const exampleGetDataTestIDLabel = (dataTestID: Uppercase<string>) => ({
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
  const { data } = useExample({ url: "http://localhost/api/data" });
  const { root, noData, title, message } = exampleGetDataTestIDLabel(
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
