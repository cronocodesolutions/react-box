import { fireEvent, screen } from '@testing-library/react';
import BaseSvg from '../../src/components/baseSvg';
import Button from '../../src/components/button';
import Checkbox from '../../src/components/checkbox';
import DataGrid from '../../src/components/dataGrid';
import Dropdown from '../../src/components/dropdown';
import Flex from '../../src/components/flex';
import Form from '../../src/components/form';
import Grid from '../../src/components/grid';
import Overlay from '../../src/components/overlay';
import RadioButton from '../../src/components/radioButton';
import Select from '../../src/components/select';
import { H1, Img, Link, Nav, P } from '../../src/components/semantics';
import Textarea from '../../src/components/textarea';
import Textbox from '../../src/components/textbox';
import Tooltip from '../../src/components/tooltip';
import VisuallyHidden from '../../src/components/visuallyHidden';

/**
 * One render per shipped component, in the smallest form its docs show — the thing a consumer
 * actually copies. `src/components/a11y.test.tsx` puts each through axe.
 *
 * A fixture is written the way a consumer would write it, not the way that scores best: a Checkbox
 * with no label stays without one, because supplying its own label is work the component owes and
 * A4 owns. What a fixture must not do is invent consumer content — an `<Img>` gets its `alt`,
 * since no library can guess that.
 *
 * These live in `dev/` rather than beside the components because `src/components/*` is the build's
 * entry glob: a fixture file there would be published as an entry point.
 */
export interface A11yFixture {
  /** How the fixture is named in the test report. */
  name: string;
  /** The component the way the docs tell you to use it — what a consumer copy-pastes. */
  render(): React.ReactElement;
  /** Reach the state under test: open the popup, focus the trigger. Runs after render. */
  setup?(): void;
  /**
   * The rules that fail today, each mapped to the roadmap step that owns the fix. The sweep fails
   * on a rule that is *not* listed, and equally on a listed rule that has stopped firing — so the
   * ledger cannot quietly rot into a list of excuses.
   */
  knownViolations?: Record<string, string>;
}

interface Person {
  id: number;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: 1, name: 'Ada', age: 36 },
  { id: 2, name: 'Grace', age: 45 },
  { id: 3, name: 'Alan', age: 41 },
];

const openPopup = () => fireEvent.click(screen.getByRole('button'));

export const fixtures: A11yFixture[] = [
  {
    name: 'Button',
    render: () => <Button>Save</Button>,
  },
  {
    name: 'Textbox',
    render: () => <Textbox name="email" placeholder="Email" />,
  },
  {
    name: 'Textarea',
    render: () => <Textarea name="bio" placeholder="Bio" />,
  },
  {
    name: 'Checkbox',
    render: () => <Checkbox name="terms" />,
    knownViolations: {
      label: 'A4 — a Checkbox has no way to carry its own label, so every consumer has to wire one by hand.',
    },
  },
  {
    name: 'RadioButton',
    render: () => (
      <Flex>
        <RadioButton name="plan" value="free" />
        <RadioButton name="plan" value="pro" />
      </Flex>
    ),
    knownViolations: {
      label: 'A4 — same gap as Checkbox, and the group needs a role="radiogroup" wrapper besides.',
    },
  },
  {
    name: 'Flex',
    render: () => (
      <Flex gap={2}>
        <P>One</P>
        <P>Two</P>
      </Flex>
    ),
  },
  {
    name: 'Grid',
    render: () => (
      <Grid gap={2}>
        <P>One</P>
        <P>Two</P>
      </Grid>
    ),
  },
  {
    name: 'Semantics',
    render: () => (
      <Nav>
        <H1>Title</H1>
        <P>Body text</P>
        <Link props={{ href: '/about' }}>About</Link>
        <Img props={{ src: 'logo.png', alt: 'Box Kite' }} />
      </Nav>
    ),
  },
  {
    // The component exists to be *read* and not seen, so the sweep checks the thing that makes it
    // worth having: the button's accessible name comes from content axe can still find.
    name: 'VisuallyHidden',
    render: () => (
      <Button>
        <VisuallyHidden tag="span">Delete the invoice</VisuallyHidden>
        <span aria-hidden>x</span>
      </Button>
    ),
  },
  {
    name: 'BaseSvg',
    render: () => (
      <BaseSvg>
        <path d="M4 12h16" />
      </BaseSvg>
    ),
  },
  {
    name: 'Form',
    render: () => (
      <Form onSubmit={() => {}}>
        <Textbox name="email" placeholder="Email" />
        <Button type="submit">Send</Button>
      </Form>
    ),
  },
  {
    name: 'Dropdown (closed)',
    render: () => (
      <Dropdown<string> defaultValue="a">
        <Dropdown.Item value="a">Alpha</Dropdown.Item>
        <Dropdown.Item value="b">Beta</Dropdown.Item>
      </Dropdown>
    ),
  },
  {
    name: 'Dropdown (open)',
    render: () => (
      <Dropdown<string> defaultValue="a">
        <Dropdown.Item value="a">Alpha</Dropdown.Item>
        <Dropdown.Item value="b">Beta</Dropdown.Item>
      </Dropdown>
    ),
    setup: openPopup,
    knownViolations: {
      'aria-allowed-attr': 'A5 — items carry aria-selected on a plain div; the attribute is only legal once they are role="option".',
    },
  },
  {
    name: 'Dropdown (searchable, open)',
    render: () => (
      <Dropdown<string> isSearchable searchPlaceholder="Search">
        <Dropdown.Item value="a">Alpha</Dropdown.Item>
        <Dropdown.Item value="b">Beta</Dropdown.Item>
      </Dropdown>
    ),
    setup: openPopup,
    knownViolations: {
      'aria-allowed-attr': 'A5 — aria-selected on item divs with no role="option".',
      'nested-interactive': 'A6 — the search input is rendered inside the trigger button, so one focusable contains another.',
    },
  },
  {
    name: 'Select (open)',
    render: () => <Select<Person, number> data={people} def={{ valueKey: 'id', displayKey: 'name' }} />,
    setup: openPopup,
    knownViolations: {
      'aria-allowed-attr': 'A5 — aria-selected on item divs with no role="option".',
      'button-name': 'A5 — with nothing selected and no placeholder the trigger renders empty, so the button has no name at all.',
    },
  },
  {
    name: 'Tooltip',
    render: () => <Tooltip content="Deletes the row">{(trigger) => <Button props={trigger}>Delete</Button>}</Tooltip>,
  },
  {
    name: 'Tooltip (open)',
    render: () => (
      <Tooltip content="Deletes the row" defaultOpen>
        {(trigger) => <Button props={trigger}>Delete</Button>}
      </Tooltip>
    ),
  },
  {
    // The positioning primitive on its own carries no ARIA and should not: it is a place to render,
    // and the pattern belongs to whatever is rendered into it.
    name: 'Overlay',
    render: () => <Overlay>Anything, anywhere</Overlay>,
  },
  {
    name: 'DataGrid',
    render: () => (
      <DataGrid<Person>
        data={people}
        def={{
          rowKey: 'id',
          columns: [
            { key: 'name', header: 'Name' },
            { key: 'age', header: 'Age' },
          ],
        }}
      />
    ),
    knownViolations: {
      'aria-required-parent': 'A7 — role="row"/"columnheader" hang off a role="presentation" root, so the grid structure is not announced.',
      'button-name': 'A7 — the group and column-chooser buttons are icon-only with no accessible name.',
    },
  },
];
