import { forwardRef, Ref } from 'react';
import Box2 from '../box2';
// import Box from '../box';
// import ObjectUtils from '../utils/object/objectUtils';

// type BoxProps = Omit<React.ComponentProps<typeof Box<'button'>>, 'ref' | 'tag'>;
// type BoxTagProps = Required<BoxProps>['props'];

// const tagProps = ['type', 'onClick'] as const;
// type TagPropsType = (typeof tagProps)[number];

// type ButtonTagProps = Omit<BoxTagProps, TagPropsType>;
// type ButtonType = Required<React.ComponentProps<'button'>>['type'];

interface Props extends React.ComponentProps<typeof Box2> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button(props: Props, ref: Ref<HTMLButtonElement>) {
  return <Box2 ref={ref} tag="button" component="button" {...props} />;
}

export default forwardRef(Button);
