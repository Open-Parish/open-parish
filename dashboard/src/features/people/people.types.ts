export type AutocompletePerson = {
  id: string;
  firstName: string;
  lastName: string;
  useCount: number;
};

export type PeopleAutocompleteResponse = {
  items: AutocompletePerson[];
};
