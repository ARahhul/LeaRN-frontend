import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Send, RotateCcw, LayoutDashboard, Award, Loader2, Timer } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import './ExamMode.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000');

const sampleQuestions = {
  BCS401: ["Explain ACID properties (10 marks)", "What is normalization? Explain 1NF 2NF 3NF (10 marks)", "Explain concurrency control (5 marks)"],
  BCS403: ["Explain A* algorithm (10 marks)", "What is minimax algorithm (5 marks)", "Explain Bayesian networks (10 marks)"],
  BCS405A: ["Explain supervised learning (10 marks)", "What is overfitting (5 marks)", "Explain SVM (10 marks)"],
  BBOC407: ["Explain blockchain technology (10 marks)", "What is consensus mechanism (5 marks)"],
  BUHK408: ["Explain human values (5 marks)", "What is professional ethics (10 marks)"],
  BAD401: ["Explain MapReduce (10 marks)", "What is Hadoop architecture (10 marks)", "Explain HDFS (5 marks)"],
};

const ExamMode = () => {
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0 && !result) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && examStarted && !result) {
      addToast('Time is up! Your answer will be submitted.', 'warning');
      submitAnswer();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, result]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = async () => {
    setGrading(true);
    try {
      const qs = sampleQuestions[subject] || sampleQuestions.BCS401; // Fallback
      setQuestions(qs);
      setExamStarted(true);
      setCurrentIndex(0);
      setTimeLeft(600); // 10 minutes per question
      addToast('Exam started! Good luck.', 'success');
    } catch (e) {
      addToast(e.message, 'error');
    } finally {
      setGrading(false);
    }
  };

  const submitAnswer = async () => {
    setGrading(true);
    try {
      const res = await fetch(`${API_URL}/exam/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentIndex],
          student_answer: studentAnswer,
          model_answer: "Please refer to the RAG model for the gold standard answer.",
          subject: subject
        }),
      });
      if (!res.ok) throw new Error('Grading failed');
      const data = await res.json();
      setResult(data);
      addToast('Answer graded successfully!', 'success');
    } catch (e) {
      addToast(e.message, 'error');
    } finally {
      setGrading(false);
    }
  };

  const nextQuestion = () => {
    setResult(null);
    setStudentAnswer('');
    setCurrentIndex(prev => prev + 1);
    setTimeLeft(600);
  };

  if (!examStarted) {
    return (
      <div className="exam-setup fade-in">
        <div className="exam-setup-card">
          <Award size={48} className="exam-award-icon" />
          <h1>Exam Simulation Mode</h1>
          <p>Test your knowledge with randomly selected PYQs and get AI-powered grading.</p>

          <div className="setup-form">
            <label>Select Subject (Optional)</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">All Subjects</option>
              <option value="BCS401">BCS401</option>
              <option value="BCS403">BCS403</option>
              <option value="BCS405A">BCS405A</option>
              <option value="BBOC407">BBOC407</option>
              <option value="BUHK408">BUHK408</option>
              <option value="BAD401">BAD401</option>
            </select>
            <button className="btn-start-exam" onClick={startExam} disabled={grading}>
              {grading ? <Loader2 className="spin" /> : 'Start Mock Exam'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <div className="exam-complete fade-in">
        <div className="complete-card">
          <CheckCircle size={64} color="#DE7356" />
          <h1>Exam Completed!</h1>
          <p>You have answered {questions.length} questions. Great effort!</p>
          <button className="btn-reset-exam" onClick={() => setExamStarted(false)}>
            <RotateCcw size={18} /> Try Another Set
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container fade-in">
      <div className="exam-progress">
        <div className="progress-header">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="timer-badge">
            <Timer size={14} /> {formatTime(timeLeft)}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="exam-card">
        <div className="question-section">
          <div className="q-label">QUESTION</div>
          <div className="q-text">{questions[currentIndex]}</div>
        </div>

        <div className="answer-section">
          <div className="q-label">YOUR ANSWER</div>
          <textarea
            className="exam-answer-textarea"
            placeholder="Type your detailed answer here..."
            value={studentAnswer}
            onChange={e => setStudentAnswer(e.target.value)}
            rows={12}
            disabled={grading || !!result}
          />

          {!result ? (
            <button className="btn-submit-answer" onClick={submitAnswer} disabled={grading || !studentAnswer.trim()}>
              {grading ? <Loader2 className="spin" /> : <><Send size={18} /> Grade My Answer</>}
            </button>
          ) : (
            <div className="grading-result fade-in">
              <div className="result-header">
                <span className="result-score">Score: {result.score}/10</span>
                <span className={`result-grade grade-${result.grade.toLowerCase()}`}>{result.grade}</span>
              </div>
              <div className="result-feedback">
                <strong>Feedback:</strong> {result.feedback}
              </div>
              <div className="result-corrections">
                <strong>Key Corrections:</strong>
                <ul>
                  {result.corrections.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <button className="btn-next-q" onClick={nextQuestion}>
                Next Question <ArrowUp size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamMode;
