/// <reference types="react" />
interface Props {
    content: string;
    offset: number;
    x: number;
    y: number;
}
declare function Tooltip({ content, offset, x, y }: Props): JSX.Element;
export default Tooltip;
