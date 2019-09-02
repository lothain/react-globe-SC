/// <reference types="react" />
import { Size } from '../types';
export default function useResize<T>(initialSize?: Size): [React.RefObject<HTMLDivElement>, Size];
