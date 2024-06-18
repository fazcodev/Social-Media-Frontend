import { useState, useEffect } from "react";
import axios from "axios";
const usePagFetch = (query, pageNumber, limit, url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setResults([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: url,
      //pass skip and limit as query params
      params: { q: query, skip: pageNumber * limit, limit: limit },
      withCredentials : true,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setResults((prevResults) => {
          return [...new Set([...prevResults, ...res.data])];
        });
        setHasMore(res.data.length > 0);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => cancel();
  }, [query, pageNumber, limit, url]);

  return { loading, error, results, hasMore };
};

export default usePagFetch;
