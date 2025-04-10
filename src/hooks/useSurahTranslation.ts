import { useState, useEffect } from 'react';
import data2 from '../data/1- english.json';
import data from '../data/2- urdu.json';

export const useSurahTranslation = () => {
  const [currentSurahs, setCurrentSurahs] = useState<number[]>([105]);

  const addNextSurah = () => {
    const last = currentSurahs[currentSurahs.length - 1];
    const next = last >= 114 ? 105 : last + 1;
    if (!currentSurahs.includes(next)) {
      setCurrentSurahs([...currentSurahs, next]);
    }
  };

  const getTranslations = () => {
    return data.filter((item) => currentSurahs.includes(item.SurahNumber));
  };

  return {
    translations: getTranslations(),
    loadNextSurah: addNextSurah,
  };
};
