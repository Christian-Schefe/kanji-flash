export type Kanji = {
  l: string; //literal
  s: number; //stroke count
  f: number | null; //frequency
  j: number | null; //jlpt level
  g: number | null; //grade level
  r: {
    //rtk info
    k: string; //keyword
    i: number; //index
  } | null;
  m: string[]; //meanings
  k: string[]; //kun readings
  o: string[]; //on readings
};
