### Base/Main component

```
import Box from "@cronocode/react-box";
```

#### Props

<table>
<tbody align=left>
<tr><th>
display
</th><td width=100%>

```ts
'none' | 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid';
```

</td></tr>
<tr><th>
position
</th><td width=100%>

```ts
'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
```

</td></tr>
<tr><th>top</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>right</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>bottom</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>left</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>width</th><td>

```ts
BoxSizeValue;
```

</td></tr>
<tr><th>height</th><td>

```ts
BoxSizeValue;
```

</td></tr>
<tr><th>minWidth</th><td>

```ts
BoxSizeValue;
```

</td></tr>
<tr><th>minHeight</th><td>

```ts
BoxSizeValue;
```

</td></tr>
<tr><th>maxWidth</th><td>

```ts
BoxSizeValue;
```

</td></tr>
<tr><th>maxHeight</th><td>

```ts
BoxSizeValue;
```

</td></tr>
<tr><th>inlineWidth</th><td>

```ts
string;
```

</td></tr>
<tr><th>inlineHeight</th><td>

```ts
string;
```

</td></tr>
<tr><th>inlineMinWidth</th><td>

```ts
string;
```

</td></tr>
<tr><th>inlineMinHeight</th><td>

```ts
string;
```

</td></tr>
<tr><th>inlineMaxWidth</th><td>

```ts
string;
```

</td></tr>
<tr><th>inlineMaxHeight</th><td>

```ts
string;
```

</td></tr>
<tr><th>margin, m</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>marginHorizontal, mx</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>marginVertical, my</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>marginTop, mt</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>marginRight, mr</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>marginBottom, mb</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>marginLeft, ml</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>border, b</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderHorizontal, bx</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderVertical, by</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderTop, bt</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRight, br</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderBottom, bb</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderLeft, bl</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderStyle, bStyle</th><td>

```ts
'solid' | 'dashed' | 'dotted' | 'double';
```

</td></tr>
<tr><th>borderRadius, bRadius</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusTop, bRadiusTop</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusRight, bRadiusRight</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusBottom, bRadiusBottom</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusLeft, bRadiusLeft</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusTopLeft, bRadiusTopLeft</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusTopRight, bRadiusTopRight</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusBottomLeft, bRadiusBottomLeft</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>borderRadiusBottomRight, bRadiusBottomRight</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>padding, p</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>paddingHorizontal, px</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>paddingVertical, py</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>paddingTop, pt</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>paddingRight, pr</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>paddingBottom, pb</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>paddingLeft, pl</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>color</th><td>

```ts
ColorType;
```

</td></tr>
<tr><th>colorHover</th><td>

```ts
ColorType;
```

</td></tr>
<tr><th>backgroundColor, bgColor</th><td>

```ts
ColorType;
```

</td></tr>
<tr><th>backgroundColorHover, bgColorHover</th><td>

```ts
ColorType;
```

</td></tr>
<tr><th>borderColor, bColor</th><td>

```ts
ColorType;
```

</td></tr>
<tr><th>borderColorHover, bColorHover</th><td>

```ts
ColorType;
```

</td></tr>
<tr><th>lineHeight</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>cursor</th><td>

```ts
CursorType;
```

</td></tr>
<tr><th>zIndex</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>overflow</th><td>

```ts
'auto' | 'hidden' | 'scroll' | 'visible';
```

</td></tr>
<tr><th>overflowX</th><td>

```ts
'auto' | 'hidden' | 'scroll' | 'visible';
```

</td></tr>
<tr><th>overflowY</th><td>

```ts
'auto' | 'hidden' | 'scroll' | 'visible';
```

</td></tr>
<tr><th>opacity</th><td>

```ts
10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
```

</td></tr>
<tr><th>fontSize</th><td>

```ts
FontSizeType;
```

</td></tr>
<tr><th>fontWeight</th><td>

```ts
100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
```

</td></tr>
<tr><th>textDecoration</th><td>

```ts
'none' | 'underline';
```

</td></tr>
<tr><th>textTransform</th><td>

```ts
'none' | 'capitalize' | 'lowercase' | 'uppercase';
```

</td></tr>
<tr><th>textAlign</th><td>

```ts
'left' | 'right' | 'center';
```

</td></tr>
<tr><th>flexWrap</th><td>

```ts
'nowrap' | 'wrap' | 'wrap-reverse';
```

</td></tr>
<tr><th>justifyContent</th><td>

```ts
'start' | 'end' | 'flex-start' | 'flex-end' | 'center' | 'left' | 'right' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
```

</td></tr>
<tr><th>alignItems</th><td>

```ts
'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end';
```

</td></tr>
<tr><th>alignContent</th><td>

```ts
'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline';
```

</td></tr>
<tr><th>flex1</th><td>

```ts
boolean;
```

</td></tr>
<tr><th>direction</th><td>

```ts
'row' | 'row-reverse' | 'column' | 'column-reverse';
```

</td></tr>
<tr><th>gap</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>rowGap</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>columnGap</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>order</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>flexGrow</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>flexShrink</th><td>

```ts
SizeType;
```

</td></tr>
<tr><th>alignSelf</th><td>

```ts
'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
```

</td></tr>
</tbody>
</table>
