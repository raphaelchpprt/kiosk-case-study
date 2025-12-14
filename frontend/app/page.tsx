'use client';

import { useState } from 'react';
import {
  Button,
  Container,
  Text,
  Stepper,
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
import {
  getAllInputQuestions,
  findParent,
  getTableSections,
  getCurrentSectionIndex,
} from '@/src/utils/questionUtils';
import { QuestionInput } from '@/src/components/QuestionInput';

export default function Home() {
  const { questions, loading, error, loadDefaultQuestions, uploadCSV } =
    useQuestions();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  //welcom screen
  if (!started) {
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
            <Group justify="center" align="start">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <FileButton onChange={handleUpload} accept=".csv">
                  {(props) => (
                    <Button
                      {...props}
                      size="lg"
                      variant="outline"
                      leftSection={<Upload size={20} />}
                    >
                      Upload data
                    </Button>
                  )}
                </FileButton>
                <Text c="dimmed" size="xs">
                  Only .csv files are supported (5MB max.)
                </Text>
              </div>
              <Button size="lg" onClick={handleStartDefault}>
                Start default form
              </Button>
            </Group>
            {uploadError && (
              <Alert
                variant="light"
                color="red"
                title="Upload Failed"
                icon={<AlertCircle size={16} />}
                style={{ marginTop: '2rem' }}
              >
                {uploadError.includes('|') ? (
                  <>
                    <Text size="sm" mb="xs">
                      The CSV file contains the following errors:
                    </Text>
                    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                      {uploadError
                        .replace('Invalid CSV:', '')
                        .split('|')
                        .map((err, index) => (
                          <li key={index}>{err.trim()}</li>
                        ))}
                    </ul>
                  </>
                ) : (
                  uploadError
                )}
              </Alert>
            )}
          </div>
        </Container>
      </div>
    );
  }

  const inputQuestions = getAllInputQuestions(questions);
  const currentQuestion = inputQuestions[currentIndex];
  const parent = currentQuestion
    ? findParent(questions, currentQuestion.id)
    : null;
  const sections = getTableSections(questions);
  const currentSectionIndex = currentQuestion
    ? getCurrentSectionIndex(questions, currentQuestion.id)
    : 0;
  const handleNext = () => {
    if (currentIndex < inputQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
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

  if (!currentQuestion) {
    return (
      <Container size="sm" style={{ marginTop: '2rem' }}>
        <Text>No questions available</Text>
      </Container>
    );
  }

  const progress = ((currentIndex + 1) / inputQuestions.length) * 100;

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
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
            width: '280px',
            padding: '2rem 1rem',
            borderRight: '1px solid #e9ecef',
            background: '#f8f9fa',
            alignContent: 'center',
          }}
        >
          <Stepper active={currentSectionIndex} orientation="vertical">
            {sections.map((section) => (
              <Stepper.Step key={section.id} label={section.labelEn} />
            ))}
          </Stepper>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
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
                <Badge variant="outline" mr="md">
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

          {/* vertical navigation */}
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
