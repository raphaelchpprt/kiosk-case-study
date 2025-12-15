'use client';

import { useState, useMemo } from 'react';
import {
  Button,
  Container,
  Text,
  Badge,
  Progress,
  FileButton,
  Group,
  Alert,
} from '@mantine/core';
import {
  ChevronUp,
  ChevronDown,
  Check,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { useQuestions } from '@/src/hooks/useQuestions';
import { getAllInputQuestions, findParent } from '@/src/utils/questionUtils';
import { SidebarStepper } from '@/src/components/SidebarStepper';
import { QuestionInput } from '@/src/components/QuestionInput';

export default function Home() {
  const { questions, loading, error, loadDefaultQuestions, uploadCSV } =
    useQuestions();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);

  const inputQuestions = useMemo(
    () => getAllInputQuestions(questions),
    [questions]
  );
  const currentQuestion = inputQuestions[currentIndex];
  const parent = currentQuestion
    ? findParent(questions, currentQuestion.id)
    : null;
  const progress = ((currentIndex + 1) / inputQuestions.length) * 100;

  const navigateTo = (newIndex: number) => {
    setCurrentIndex(newIndex);
    if (newIndex > maxVisitedIndex) {
      setMaxVisitedIndex(newIndex);
    }
  };

  const handleStartDefault = async () => {
    const success = await loadDefaultQuestions();
    if (success) {
      setStarted(true);
    }
  };

  const handleUpload = async (file: File | null) => {
    setUploadError(null);
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadError('Please upload a valid CSV file.');
        return;
      }

      const result = await uploadCSV(file);
      if (result.success) {
        setStarted(true);
      } else {
        setUploadError(result.error || 'Unknown upload error');
      }
    }
  };

  const handleJumpTo = (questionId: string) => {
    const index = inputQuestions.findIndex((q) => q.id === questionId);
    if (index !== -1) navigateTo(index);
  };

  const handleNext = () => {
    if (currentIndex < inputQuestions.length - 1) {
      navigateTo(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setStarted(false);
    }
  };

  const handleChange = (value: string | number) => {
    if (!currentQuestion) return;
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleSubmitAnswer = () => {
    if (currentIndex < inputQuestions.length - 1) {
      handleNext();
    } else {
      alert(JSON.stringify(answers, null, 2));
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!started) {
    return (
      <WelcomeScreen
        onStart={handleStartDefault}
        onUpload={handleUpload}
        error={uploadError}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <Container size="sm" style={{ marginTop: '2rem' }}>
        <Text>No questions available</Text>
      </Container>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
        <Container size="lg">
          <Progress value={progress} size="md" />
        </Container>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '300px',
            borderRight: '1px solid #e9ecef',
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <SidebarStepper
              questions={questions}
              allInputs={inputQuestions}
              answers={answers}
              currentQuestionId={currentQuestion?.id}
              onJumpTo={handleJumpTo}
              maxVisitedIndex={maxVisitedIndex}
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            paddingBottom: '15vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              padding: '2rem 3rem',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {parent && (
              <Text size="lg" fw={600} mb="sm" c="dimmed">
                {parent.labelEn}
              </Text>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Badge
                  variant="outline"
                  mr="md"
                  size="lg"
                  style={{ flexShrink: 0 }}
                >
                  {currentIndex + 1}
                </Badge>
                <Text size="xl" fw={600}>
                  {currentQuestion.labelEn}
                </Text>
              </div>
              <QuestionInput
                question={currentQuestion}
                value={answers[currentQuestion.id] || ''}
                onChange={handleChange}
                onSubmit={handleSubmitAnswer}
              />
            </div>

            <Button
              size="lg"
              leftSection={<Check size={20} />}
              onClick={handleSubmitAnswer}
              color={
                currentIndex === inputQuestions.length - 1 ? 'teal' : 'blue'
              }
            >
              {currentIndex === inputQuestions.length - 1 ? 'Finish' : 'OK'}
            </Button>
          </div>

          <div style={{ position: 'fixed', right: '2rem', bottom: '2rem' }}>
            <Button.Group orientation="horizontal">
              <Button variant="default" onClick={handlePrevious}>
                <ChevronUp size={24} />
              </Button>
              <Button
                variant="default"
                onClick={handleNext}
                disabled={currentIndex === inputQuestions.length - 1}
              >
                <ChevronDown size={24} />
              </Button>
            </Button.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({
  onStart,
  onUpload,
  error,
}: {
  onStart: () => void;
  onUpload: (file: File | null) => void;
  error: string | null;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
      }}
    >
      <Container size="sm">
        <div
          style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '3rem',
            border: '1px solid #cececeff',
          }}
        >
          <Text
            size="xl"
            fw={700}
            mb="md"
            style={{ fontSize: '2rem', textAlign: 'center' }}
          >
            ESG Reporting form
          </Text>
          <Text c="dimmed" mb="xl">
            Complete the employee data collection form for your ESG/CSRD
            reporting.
          </Text>
          <Group justify="center" align="start" grow>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <FileButton onChange={onUpload} accept=".csv">
                {(props) => (
                  <Button
                    {...props}
                    size="lg"
                    variant="outline"
                    leftSection={<Upload size={20} />}
                    fullWidth
                  >
                    Upload data
                  </Button>
                )}
              </FileButton>
              <Text c="dimmed" size="xs">
                Only valid .csv files are supported (5MB max.)
              </Text>
            </div>
            <Button size="lg" onClick={onStart} fullWidth>
              Start default form
            </Button>
          </Group>
          {error && (
            <Alert
              variant="light"
              color="red"
              title="Upload Failed"
              icon={<AlertCircle size={16} />}
              style={{ marginTop: '2rem' }}
            >
              {error.includes('|') ? (
                <>
                  <Text size="sm" mb="xs">
                    The file contains the following errors:
                  </Text>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {error
                      .replace('Invalid CSV:', '')
                      .split('|')
                      .map((err, index) => (
                        <li key={index}>{err.trim()}</li>
                      ))}
                  </ul>
                </>
              ) : (
                error
              )}
            </Alert>
          )}
        </div>
      </Container>
    </div>
  );
}
