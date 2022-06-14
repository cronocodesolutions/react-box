import classes from './box.module.css';
import { SizeType } from '../css.variables';

interface BoxPadding {
  p?: SizeType;
  px?: SizeType;
  py?: SizeType;
  pt?: SizeType;
  pr?: SizeType;
  pb?: SizeType;
  pl?: SizeType;
}

interface Props extends BoxPadding {}

export default function Box(props: Props) {
  return <div className={classes.box}>This is a box component</div>;
}
