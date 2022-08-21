const Endpoint = process.env.REACT_APP_API_URL;
export const searchMovies = (term?: string) => {
  const query = term ? `?title_like=${term}` : "";
  const response = fetch(`${Endpoint}${query}`).then((response) =>
    response.json()
  );
  return response.then((data) => data.map((item: any) => item.title));
};
