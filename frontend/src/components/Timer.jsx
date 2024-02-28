import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';

const Timer = () => {
  const [studyDuration, setStudyDuration] = useState(25); // in minutes
  const [restDuration, setRestDuration] = useState(5); // in minutes
  const [cycleCount, setCycleCount] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timer, setTimer] = useState(0); // in seconds
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let interval = null;

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (isActive && timer === 0) {
      if (isStudyTime && currentCycle < cycleCount) {
        setIsStudyTime(false);
        setTimer(restDuration * 60);
      } else if (!isStudyTime) {
        setCurrentCycle((cycle) => cycle + 1);
        if (currentCycle + 1 < cycleCount) {
          setIsStudyTime(true);
          setTimer(studyDuration * 60);
        } else {
          setIsActive(false);
          toast({
            title: 'Pomodoro cycle completed!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timer, isStudyTime, currentCycle, cycleCount, studyDuration, restDuration, toast]);

  const handlePausePlay = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimer(studyDuration * 60);
    setCurrentCycle(0);
    setIsStudyTime(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = `0${time % 60}`.slice(-2);
    return `${minutes}:${seconds}`;
  };

  return (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel htmlFor='study-duration'>Study Duration (minutes)</FormLabel>
        <Input
          id='study-duration'
          type='number'
          value={studyDuration}
          onChange={(e) => setStudyDuration(Number(e.target.value))}
          isDisabled={isActive}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='rest-duration'>Rest Duration (minutes)</FormLabel>
        <Input
          id='rest-duration'
          type='number'
          value={restDuration}
          onChange={(e) => setRestDuration(Number(e.target.value))}
          isDisabled={isActive}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='cycle-count'>Cycle Count</FormLabel>
        <Input
          id='cycle-count'
          type='number'
          value={cycleCount}
          onChange={(e) => setCycleCount(Number(e.target.value))}
          isDisabled={isActive}
        />
      </FormControl>
      <HStack>
        <Button onClick={handlePausePlay}>
          {isActive ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={handleReset} isDisabled={isActive && timer === studyDuration * 60}>
          Reset
        </Button>
      </HStack>
      <Box>
        <Text fontSize="xl">
          {isStudyTime ? 'Study Time' : 'Rest Time'}: {formatTime(timer)}
        </Text>
        <Text fontSize="lg">
          Cycle {currentCycle} of {cycleCount}
        </Text>
      </Box>
    </VStack>
  );
};

export default Timer;
