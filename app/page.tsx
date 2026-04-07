"use client";

import { useEffect, useState } from "react";
import { questions } from "../data/questions";

type ColorOption = {
  name: string;
  value: string;
  textColor: string;
};

const colorOptions: ColorOption[] = [
  { name: "8人(強)", value: "#112951", textColor: "#FFFFFF" },
  { name: "8人(中)", value: "#AB2A27", textColor: "#FFFFFF" },
  { name: "8人(弱)", value: "#EAAF3E", textColor: "#000000" },
  { name: "6~7人", value: "#3C8440", textColor: "#FFFFFF" },
  { name: "4~5人", value: "#429FCA", textColor: "#FFFFFF" },
  { name: "3人", value: "#FEFEFF", textColor: "#000000" },
  { name: "2人", value: "#BA1FE5", textColor: "#FFFFFF" },
  { name: "BBのみ", value: "#F9A5E8", textColor: "#000000" },
  { name: "フォールド", value: "#8A8888", textColor: "#FFFFFF" },
];

const TOTAL_QUESTIONS = 10;

function getRandomIndex(excludeIndex: number | null = null) {
  let randomIndex = Math.floor(Math.random() * questions.length);

  while (randomIndex === excludeIndex) {
    randomIndex = Math.floor(Math.random() * questions.length);
  }

  return randomIndex;
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [wrongSelections, setWrongSelections] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [effectKey, setEffectKey] = useState(0);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasAnsweredOnce, setHasAnsweredOnce] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentIndex(getRandomIndex());
  }, []);

  const currentQuestion = questions[currentIndex];
  const correctColor = currentQuestion.color;
  const hasCleared = selectedColor === correctColor;

  const handleAnswer = (selected: string) => {
    if (hasCleared || isFinished || !isMounted) return;

    const correct = selected === correctColor;

    setSelectedColor(selected);
    setIsCorrect(correct);
    setEffectKey((prev) => prev + 1);

    if (!hasAnsweredOnce) {
      setHasAnsweredOnce(true);

      if (correct) {
        setScore((prev) => prev + 1);
      }
    }

    if (correct) {
      return;
    }

    setWrongSelections((prev) => {
      if (prev.includes(selected)) return prev;
      return [...prev, selected];
    });
  };

  const handleNextQuestion = () => {
    if (isFinished || !hasCleared) return;

    if (questionNumber >= TOTAL_QUESTIONS) {
      setIsFinished(true);
      return;
    }

    const nextIndex = getRandomIndex(currentIndex);
    setCurrentIndex(nextIndex);
    setSelectedColor(null);
    setWrongSelections([]);
    setIsCorrect(null);
    setHasAnsweredOnce(false);
    setQuestionNumber((prev) => prev + 1);
    setEffectKey((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(getRandomIndex());
    setSelectedColor(null);
    setWrongSelections([]);
    setIsCorrect(null);
    setEffectKey((prev) => prev + 1);
    setQuestionNumber(1);
    setScore(0);
    setIsFinished(false);
    setHasAnsweredOnce(false);
  };

  const getCardEffectClass = () => {
    if (isCorrect === true) return "animate-correct";
    if (isCorrect === false) return "animate-wrong";
    return "";
  };

  if (isFinished) {
    return (
      <main
        className="min-h-screen bg-white text-black flex items-center justify-center p-6"
        style={{ colorScheme: "light" }}
      >
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white text-black p-6 shadow-sm text-center">
          <p className="text-sm text-gray-700 mb-2">結果</p>
          <h1 className="text-3xl font-bold mb-4 text-black">10問終了！</h1>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-6">
            <p className="text-gray-800 mb-2">正解数</p>
            <p className="text-5xl font-bold text-black">{score} / 10</p>
          </div>

          <button
            onClick={handleRestart}
            className="w-full rounded-xl bg-black text-white py-3 font-bold transition hover:opacity-90 active:scale-[0.99]"
          >
            もう一度遊ぶ
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main
        className="min-h-screen bg-white text-black flex items-center justify-center p-6"
        style={{ colorScheme: "light" }}
      >
        <div
          key={effectKey}
          className={`relative w-full max-w-md rounded-2xl border border-gray-200 bg-white text-black p-6 shadow-sm transition-all duration-300 ${
            getCardEffectClass()
          } ${
            isCorrect === true
              ? "shadow-[0_0_0_4px_rgba(60,132,64,0.18),0_12px_30px_rgba(60,132,64,0.20)]"
              : ""
          } ${
            isCorrect === false
              ? "shadow-[0_0_0_4px_rgba(171,42,39,0.18),0_12px_30px_rgba(171,42,39,0.20)]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-6 text-sm font-medium">
            <p className="text-gray-700">
              {questionNumber} / {TOTAL_QUESTIONS} 問
            </p>
            <p className="text-gray-700">正解数: {score}</p>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            ハンド色当てゲーム
          </h1>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-700 mb-2">ハンド</p>
            <p className="text-4xl font-bold text-black">{currentQuestion.hand}</p>
          </div>

          <p className="text-center mb-4 text-black">このハンドは何色？</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {colorOptions.map((color) => {
              const isSelected = selectedColor === color.value;
              const isAnswer = color.value === correctColor;
              const isWrongSelected = wrongSelections.includes(color.value);
              const showCorrectAnswer = hasCleared && isAnswer;

              return (
                <button
                  key={color.value}
                  onClick={() => handleAnswer(color.value)}
                  disabled={hasCleared || isWrongSelected || isFinished}
                  className={`rounded-xl py-3 font-bold border transition-all duration-200 ${
                    hasCleared || isWrongSelected || isFinished
                      ? "cursor-default"
                      : "active:scale-95"
                  } ${isSelected ? "scale-[1.03]" : ""} ${
                    showCorrectAnswer
                      ? "ring-4 ring-black/70 border-black"
                      : "border-gray-300"
                  } ${isWrongSelected ? "opacity-40" : "opacity-100"}`}
                  style={{
                    backgroundColor: color.value,
                    color: color.textColor,
                    boxShadow: isSelected
                      ? "0 8px 20px rgba(0,0,0,0.18)"
                      : "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  <span className="block">{color.name}</span>

                  {isSelected && !hasCleared && !isWrongSelected && (
                    <span className="mt-1 block text-xs opacity-90">選択中</span>
                  )}

                  {isWrongSelected && (
                    <span className="mt-1 block text-xs font-bold opacity-90">
                      ×
                    </span>
                  )}

                  {showCorrectAnswer && (
                    <span className="mt-1 block text-xs font-bold opacity-90">
                      正解
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="min-h-[64px] flex items-center justify-center mb-4">
            {isCorrect === true && (
              <div className="w-full rounded-full bg-green-100 text-green-700 text-sm font-bold px-4 py-3 text-center animate-pop">
                正解！
              </div>
            )}

            {isCorrect === false && (
              <div className="w-full rounded-full bg-red-100 text-red-700 text-sm font-bold px-4 py-3 text-center animate-pop">
                不正解
              </div>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!hasCleared}
            className={`w-full rounded-xl py-3 font-bold transition active:scale-[0.99] ${
              hasCleared
                ? "bg-black text-white hover:opacity-90"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {questionNumber === TOTAL_QUESTIONS ? "結果を見る" : "次の問題"}
          </button>
        </div>
      </main>

      <style jsx global>{`
        @keyframes correctFlash {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes wrongShake {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes popIn {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-correct {
          animation: correctFlash 0.45s ease;
        }

        .animate-wrong {
          animation: wrongShake 0.4s ease;
        }

        .animate-pop {
          animation: popIn 0.25s ease;
        }
      `}</style>
    </>
  );
}