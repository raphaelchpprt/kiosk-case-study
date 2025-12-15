'use client';

import { useState, useMemo } from 'react';
import { Question } from '../types/question';
import { getAllInputQuestions, getTableSections } from '../utils/questionUtils';
import {
  Stepper,
  ScrollArea,
  Text,
  Tooltip,
  Collapse,
  Button,
  Box,
} from '@mantine/core';
import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SidebarStepperProps {
  questions: Question[];
  allInputs: Question[];
  answers: Record<string, string | number>;
  currentQuestionId: string;
  onJumpTo: (questionId: string) => void;
  maxVisitedIndex: number;
}

const getSectionStyle = (
  status: string,
  isCurrentSection: boolean,
  isVisited: boolean
) => {
  if (isCurrentSection)
    return {
      color: 'blue',
      icon: null,
    };
  if (status === 'completed')
    return { color: 'teal', icon: <Check size={18} /> };
  if (status === 'partial' || isVisited)
    return { color: 'yellow', icon: <AlertCircle size={18} /> };
  return { color: 'gray', icon: null };
};

const getSectionStatus = (
  sectionInputs: Question[],
  answers: Record<string, string | number>
) => {
  if (sectionInputs.length === 0) return 'completed';
  const answeredCount = sectionInputs.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ''
  ).length;
  if (answeredCount === sectionInputs.length) return 'completed';
  if (answeredCount > 0) return 'partial';
  return 'empty';
};

export function SidebarStepper({
  questions,
  allInputs,
  answers,
  currentQuestionId,
  onJumpTo,
  maxVisitedIndex,
}: SidebarStepperProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sections = useMemo(() => {
    const tableSections = getTableSections(questions);
    const tableSectionsWithInputs = tableSections.map((section) => ({
      ...section,
      inputs: getAllInputQuestions([section]),
    }));

    return tableSectionsWithInputs;
  }, [questions]);

  const maxVisitedQuestion = allInputs[maxVisitedIndex];

  const maxVisitedSectionIndex = sections.findIndex((section) =>
    section.inputs.some((q) => q.id === maxVisitedQuestion?.id)
  );

  const activeSectionIndex = sections.findIndex((section) =>
    section.inputs.some((q) => q.id === currentQuestionId)
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  return (
    <ScrollArea h="100%" type="auto" offsetScrollbars>
      <Stepper
        active={activeSectionIndex}
        orientation="vertical"
        size="sm"
        style={{ padding: '2rem 1rem' }}
      >
        {sections.map((section, index) => {
          const status = getSectionStatus(section.inputs, answers);
          const isCurrentSection = index === activeSectionIndex;
          const isVisited = index <= maxVisitedSectionIndex;
          const { color: stepColor, icon: StepIcon } = getSectionStyle(
            status,
            isCurrentSection,
            isVisited
          );

          const IconWithTooltip = StepIcon ? (
            <Tooltip
              label={status === 'completed' ? 'Completed' : 'Incomplete'}
              position="right"
              withArrow
            >
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                {StepIcon}
              </Box>
            </Tooltip>
          ) : null;

          return (
            <Stepper.Step
              key={section.id}
              label={
                <Tooltip
                  key={section.id}
                  label={section.labelEn}
                  position="right"
                  withArrow
                  multiline
                  w={200}
                >
                  <Text
                    size="sm"
                    fw={isCurrentSection ? 600 : 500}
                    lineClamp={1}
                  >
                    {section.labelEn}
                  </Text>
                </Tooltip>
              }
              description={
                <Box mt="xs">
                  <Collapse in={isCurrentSection || openSections[section.id]}>
                    <Box>
                      {section.inputs.map((q) => {
                        const isAnswered =
                          answers[q.id] !== undefined && answers[q.id] !== '';
                        const isCurrentQuestion = q.id === currentQuestionId;
                        const questionIndex = allInputs.findIndex(
                          (i) => i.id === q.id
                        );
                        const isClickable = questionIndex <= maxVisitedIndex;

                        const textColor = isCurrentQuestion
                          ? 'blue'
                          : isAnswered
                          ? 'teal'
                          : isClickable
                          ? 'yellow.7'
                          : 'dimmed';

                        return (
                          <Tooltip
                            key={q.id}
                            label={q.labelEn}
                            position="right"
                            withArrow
                            multiline
                            w={200}
                          >
                            <Box
                              onClick={
                                isClickable ? () => onJumpTo(q.id) : undefined
                              }
                              style={{
                                cursor: isClickable ? 'pointer' : 'default',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                marginBottom: '4px',
                                backgroundColor: isCurrentQuestion
                                  ? 'var(--mantine-color-blue-0)'
                                  : 'transparent',
                                borderLeft: `2px solid ${
                                  isCurrentQuestion
                                    ? 'var(--mantine-color-blue-6)'
                                    : 'transparent'
                                }`,
                                width: '100%',
                                maxWidth: '210px',
                                overflow: 'hidden',
                                opacity: isClickable ? 1 : 0.5,
                              }}
                            >
                              <Text
                                size="xs"
                                c={textColor}
                                fw={isCurrentQuestion ? 600 : 400}
                                truncate="end"
                              >
                                {q.labelEn}
                              </Text>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </Collapse>
                  {!isCurrentSection && index <= maxVisitedSectionIndex && (
                    <Button
                      component="div"
                      variant="subtle"
                      size="xs"
                      onClick={() => toggleSection(section.id)}
                      rightSection={
                        openSections[section.id] ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      }
                      color="gray"
                    >
                      {openSections[section.id]
                        ? 'Hide questions'
                        : 'Show questions'}
                    </Button>
                  )}
                </Box>
              }
              color={stepColor}
              completedIcon={IconWithTooltip}
              icon={isCurrentSection ? undefined : IconWithTooltip}
              state={status === 'completed' ? 'stepCompleted' : undefined}
              styles={{
                stepIcon: {
                  backgroundColor:
                    !isCurrentSection && stepColor !== 'gray'
                      ? `var(--mantine-color-${stepColor}-6)`
                      : undefined,
                  borderColor:
                    !isCurrentSection && stepColor !== 'gray'
                      ? `var(--mantine-color-${stepColor}-6)`
                      : undefined,
                  color:
                    !isCurrentSection && stepColor !== 'gray'
                      ? 'white'
                      : undefined,
                },
              }}
            />
          );
        })}
      </Stepper>
    </ScrollArea>
  );
}
