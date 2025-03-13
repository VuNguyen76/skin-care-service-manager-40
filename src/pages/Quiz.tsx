
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock questions - these would come from the API
const quizQuestions = [
  {
    id: 1,
    question: "What is your skin type?",
    type: "SINGLE_CHOICE",
    options: [
      { id: 1, text: "Dry" },
      { id: 2, text: "Oily" },
      { id: 3, text: "Combination" },
      { id: 4, text: "Normal" },
      { id: 5, text: "Sensitive" },
    ],
  },
  {
    id: 2,
    question: "What skin concerns do you have? (Select all that apply)",
    type: "MULTIPLE_CHOICE",
    options: [
      { id: 6, text: "Acne" },
      { id: 7, text: "Aging/Fine Lines" },
      { id: 8, text: "Hyperpigmentation" },
      { id: 9, text: "Redness" },
      { id: 10, text: "Dryness/Flakiness" },
    ],
  },
  {
    id: 3,
    question: "Do you have any allergies or sensitivities to skincare ingredients?",
    type: "TEXT",
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSingleChoiceAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleMultipleChoiceAnswer = (optionId: number) => {
    setAnswers((prev) => {
      const currentAnswers = prev[currentQuestion.id] || [];
      if (currentAnswers.includes(optionId)) {
        return {
          ...prev,
          [currentQuestion.id]: currentAnswers.filter((id: number) => id !== optionId),
        };
      } else {
        return {
          ...prev,
          [currentQuestion.id]: [...currentAnswers, optionId],
        };
      }
    });
  };

  const handleTextAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      // In a real application, submit answers to backend here
      console.log("Quiz answers:", answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // In a real application, you would process the recommendations here
    navigate("/quiz-results");
  };

  const isNextDisabled = () => {
    if (!currentQuestion) return true;
    if (currentQuestion.type === "SINGLE_CHOICE" && !answers[currentQuestion.id]) return true;
    if (currentQuestion.type === "MULTIPLE_CHOICE" && (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0)) return true;
    if (currentQuestion.type === "TEXT" && (!answers[currentQuestion.id] || answers[currentQuestion.id].trim() === "")) return true;
    return false;
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Skin Care Quiz</CardTitle>
            <CardDescription className="text-center">
              Answer a few questions to get personalized skincare recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isCompleted ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>

                {currentQuestion.type === "SINGLE_CHOICE" && (
                  <RadioGroup
                    onValueChange={handleSingleChoiceAnswer}
                    value={answers[currentQuestion.id] || ""}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "MULTIPLE_CHOICE" && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isChecked = (answers[currentQuestion.id] || []).includes(option.id);
                      return (
                        <div key={option.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`option-${option.id}`}
                            checked={isChecked}
                            onChange={() => handleMultipleChoiceAnswer(option.id)}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === "TEXT" && (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleTextAnswer(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-2xl font-semibold mb-4">Quiz Completed!</h3>
                <p className="text-gray-600 mb-8">
                  Thank you for completing the quiz. We'll analyze your answers and provide personalized recommendations.
                </p>
                <Button onClick={handleSubmit} size="lg">
                  View My Recommendations
                </Button>
              </div>
            )}
          </CardContent>
          {!isCompleted && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={isNextDisabled()}>
                {currentQuestionIndex < quizQuestions.length - 1 ? "Next" : "Complete Quiz"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Quiz;
