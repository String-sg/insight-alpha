declare module '@react-native-community/slider' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  interface SliderProps {
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    maximumValue?: number;
    minimumTrackTintColor?: string;
    minimumValue?: number;
    onSlidingComplete?: (value: number) => void;
    onValueChange?: (value: number) => void;
    thumbStyle?: StyleProp<ViewStyle>;
    trackStyle?: StyleProp<ViewStyle>;
    value?: number;
    maximumTrackTintColor?: string;
    step?: number;
    animateTransitions?: boolean;
    animationType?: 'spring' | 'timing';
    orientation?: 'horizontal' | 'vertical';
    thumbTouchSize?: {
      width: number;
      height: number;
    };
    debugTouchArea?: boolean;
    allMeasurements?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
  }

  export default class Slider extends Component<SliderProps> {}
}