// size-limit fixture: one entry importing every public export so shared chunks are
// counted once (listing the entries directly in size-limit sums the shared core per file).
// Add a line here when a new component entry is added to the build.
import * as box from '../dist/box.mjs';
import * as core from '../dist/core.mjs';
import * as ssg from '../dist/ssg.mjs';
import * as baseSvg from '../dist/components/baseSvg.mjs';
import * as button from '../dist/components/button.mjs';
import * as checkbox from '../dist/components/checkbox.mjs';
import * as dataGrid from '../dist/components/dataGrid.mjs';
import * as dropdown from '../dist/components/dropdown.mjs';
import * as flex from '../dist/components/flex.mjs';
import * as form from '../dist/components/form.mjs';
import * as grid from '../dist/components/grid.mjs';
import * as radioButton from '../dist/components/radioButton.mjs';
import * as select from '../dist/components/select.mjs';
import * as semantics from '../dist/components/semantics.mjs';
import * as textarea from '../dist/components/textarea.mjs';
import * as textbox from '../dist/components/textbox.mjs';
import * as tooltip from '../dist/components/tooltip.mjs';

console.log(
  box,
  core,
  ssg,
  baseSvg,
  button,
  checkbox,
  dataGrid,
  dropdown,
  flex,
  form,
  grid,
  radioButton,
  select,
  semantics,
  textarea,
  textbox,
  tooltip,
);
