import { useEffect } from "react";
import { Note, NoteBig } from "../components/icons/note";

import { RandomNoteContainer } from "../components/random-notes";

type RandomNotesOptions = {
  maxX?: number;
  maxY?: number;
};

export const useRandomNotes = (
  container: React.RefObject<HTMLDivElement>,
  notes: React.MutableRefObject<JSX.Element[]>,
  options?: RandomNotesOptions,
) => {
  const maximumX = options?.maxX ?? 0.75;
  const maximumY = options?.maxY ?? 1 / 3;

  useEffect(() => {
    if (!container.current || notes.current.length) {
      return;
    }

    for (let i = 0; i < 10; i++) {
      const x = Math.floor(
        container.current.clientWidth * maximumX * Math.random(),
      );

      const y = Math.floor(
        container.current.clientHeight * maximumY * Math.random(),
      );

      const isWhite = x < container.current.clientWidth / 2;

      notes.current = [
        ...notes.current,
        <RandomNoteContainer
          key={i}
          x={x}
          y={y}
          isWhite={isWhite}
          rotation={Math.floor(-45 * Math.random())}
        >
          {Math.floor(Math.random() * 2) === 1 ? <Note /> : <NoteBig />}
        </RandomNoteContainer>,
      ];
    }
  }, [container]);
};
