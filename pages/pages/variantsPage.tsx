import { SlidersHorizontal } from 'lucide-react';
import { ReactNode, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';
import Presence from '../../src/components/presence';
import { H2 } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import Reveal from '../components/reveal';
import useTableOfContents from '../hooks/useTableOfContents';

export default function VariantsPage() {
  useTableOfContents(sidebarLinks);
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [selected, setSelected] = useState('Overview');
  const [agreed, setAgreed] = useState(false);
  const [shown, setShown] = useState(false);

  return (
    <Box>
      <PageHeader
        icon={SlidersHorizontal}
        title="State Variants"
        description="Style an element by an attribute it carries, by what it contains, or by a state it is not in — data-*, aria-*, :has() and :not() as nested props."
        badge="NEW"
      />

      <Reveal delay={0.1}>
        <Flex d="column" gap={10}>
          <Section id="concept" title="A state somebody else set is still a prop">
            <Mono>hover</Mono> and <Mono>checked</Mono> describe states the browser knows about. Everything else — a menu that is open, a
            row that is selected, a step that is loading — is a state <em>your</em> code knows about, and until now the only way to style it
            was a ternary in the markup. The four keys on this page put it back in CSS: they add a fragment to the element's own selector,
            so one rule covers every element in that state instead of a new class per render.
          </Section>

          <Code
            id="concept-code"
            label="The four keys"
            language="jsx"
            codeOnly
            code={`<Box
  dataAttr={{ 'state=open': { opacity: 1 }, loading: { cursor: 'wait' } }}   // [data-state="open"], [data-loading]
  ariaAttr={{ selected: { bgColor: 'indigo-500' } }}                        // [aria-selected="true"]
  has={{ ':checked': { borderColor: 'indigo-500' } }}                       // :has(:checked)
  not={{ hover: { opacity: 0.7 } }}                                         // :not(:hover)
/>`}
          />

          <Section id="data" title="dataAttr — the attribute your own code writes">
            The record key is the attribute: <Mono>'state=open'</Mono> becomes <Mono>[data-state="open"]</Mono>, and a bare{' '}
            <Mono>'loading'</Mono> becomes <Mono>[data-loading]</Mono> — present with any value at all. The attribute itself goes in{' '}
            <Mono>props</Mono>, where every attribute goes.
          </Section>

          <Code
            id="data-demo"
            label="dataAttr"
            language="jsx"
            context="declare const state: 'idle' | 'busy' | 'done';"
            code={`<Box
  props={{ 'data-state': state }}
  dataAttr={{
    'state=idle': { bgColor: 'slate-500' },
    'state=busy': { bgColor: 'amber-500' },
    'state=done': { bgColor: 'emerald-500' },
  }}
/>`}
          >
            <Flex d="column" gap={4} ai="flex-start">
              <Box
                props={{ 'data-state': state }}
                px={5}
                py={3}
                borderRadius={2}
                fontSize={14}
                color="white"
                transitionDuration={250}
                dataAttr={{
                  'state=idle': { bgColor: 'slate-500' },
                  'state=busy': { bgColor: 'amber-500' },
                  'state=done': { bgColor: 'emerald-500' },
                }}
              >
                data-state={state}
              </Box>
              <Flex gap={2}>
                {(['idle', 'busy', 'done'] as const).map((next) => (
                  <Button key={next} variant="secondary" onClick={() => setState(next)}>
                    {next}
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Code>

          <Section id="aria" title="ariaAttr — the state a screen reader is already told about">
            Same grammar, one difference: a bare key means <Mono>="true"</Mono>, because that is what an ARIA state means. So{' '}
            <Mono>{`ariaAttr={{ selected: … }}`}</Mono> is <Mono>[aria-selected="true"]</Mono> and no second source of truth is invented —
            the attribute that makes the tab list correct is the one that colours it.
          </Section>

          <Code
            id="aria-demo"
            label="ariaAttr"
            language="jsx"
            context="declare const selected: string;declare const setSelected: (value: string) => void;"
            code={`{['Overview', 'Usage', 'API'].map((tab) => (
  <Button
    key={tab}
    props={{ role: 'tab', 'aria-selected': tab === selected }}
    onClick={() => setSelected(tab)}
    ariaAttr={{ selected: { bgColor: 'indigo-500', color: 'white' } }}
  >
    {tab}
  </Button>
))}`}
          >
            <Flex gap={2} props={{ role: 'tablist' }}>
              {['Overview', 'Usage', 'API'].map((tab) => (
                <Button
                  key={tab}
                  variant="secondary"
                  props={{ role: 'tab', 'aria-selected': tab === selected }}
                  onClick={() => setSelected(tab)}
                  ariaAttr={{ selected: { bgColor: 'indigo-500', color: 'white', borderColor: 'indigo-500' } }}
                >
                  {tab}
                </Button>
              ))}
            </Flex>
          </Code>

          <Section id="has" title="has — style a parent by what is inside it">
            <Mono>has</Mono> puts its key inside <Mono>:has()</Mono>, so a container can react to its own contents with no state lifted out
            of the DOM. The library already ships the common ones as pseudo-class props (<Mono>hasChecked</Mono>, <Mono>hasFocus</Mono>,{' '}
            <Mono>hasInvalid</Mono>); this is the general form for everything else.
          </Section>

          <Code
            id="has-demo"
            label="has"
            language="jsx"
            code={`<Box has={{ 'input:checked': { borderColor: 'indigo-500', bgColor: 'indigo-50' } }}>
  <Checkbox label="I agree to the terms" />
</Box>`}
          >
            <Box
              p={4}
              b={1}
              borderRadius={2}
              borderColor="slate-300"
              transitionDuration={250}
              has={{ 'input:checked': { borderColor: 'indigo-500' } }}
            >
              <Checkbox label="I agree to the terms" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
            </Box>
          </Code>

          <Section id="not" title="not — the state you are not in">
            <Mono>not</Mono> is keyed by pseudo-class name rather than by a selector, so it stays typed and autocompletes: every key{' '}
            <Mono>hover</Mono>, <Mono>checked</Mono>, <Mono>disabled</Mono> and the rest already accept, minus the ones a{' '}
            <Mono>:not()</Mono> cannot hold. It is the honest way to say "dim everything that is not the one being pointed at" without
            writing the positive rule twice.
          </Section>

          <Code
            id="not-demo"
            label="not"
            language="jsx"
            codeOnly
            code={`<Box hoverGroup={{ deck: { not: { hover: { opacity: 0.5 } } } }} />`}
          />

          <Section id="composing" title="Everything else nests around them, in either direction">
            A variant is a fragment on the element's own compound selector, so it composes with all three of the other nesting kinds: a
            breakpoint or a preference wraps the rule, a theme or a group puts an ancestor in front of it, and a pseudo-class joins the same
            compound. The class name is built from the <em>set</em> rather than the order, so <Mono>{`dataAttr={{ x: { not: … } }}`}</Mono>{' '}
            and <Mono>{`not={{ … : { dataAttr: { x } } }}`}</Mono> resolve to one class and one rule.
          </Section>

          <Code
            id="composing-code"
            label="Composing"
            language="css"
            codeOnly
            check={false}
            code={`/* md={{ dataAttr: { 'state=open': { hover: { color: 'red-500' } } } }} */

@media (min-width: 768px) {
  .md-hover-dataAttr-state\\=open-color-red-500[data-state="open"]:hover { color: var(--red-500) }
}

/* No cascade rank of its own: .a[data-state="open"] is 0,2,0 against .b's 0,1,0,
   so the variant already outranks the plain class it overrides. */`}
          />

          <Section id="presence" title="The exit, written as CSS instead of a ternary">
            <Mono>&lt;Presence&gt;</Mono> hands its child <Mono>{`{ 'data-state': 'open' | 'closed' }`}</Mono> — the Radix and Base UI
            spelling, so a selector written for either works here. With <Mono>dataAttr</Mono> the whole entrance and exit is two records and
            no conditional value in the markup: the element says where it is, and the stylesheet says what that looks like.
          </Section>

          <Code
            id="presence-demo"
            label="Presence + dataAttr"
            language="jsx"
            context="declare const shown: boolean;"
            code={`<Presence present={shown}>
  {({ ref, props }) => (
    <Box
      ref={ref}
      props={props}
      transitionDuration={320}
      startingStyle={{ opacity: 0, translateY: -2 }}
      dataAttr={{
        'state=open': { opacity: 1, translateY: 0 },
        'state=closed': { opacity: 0, translateY: -2 },
      }}
    />
  )}
</Presence>`}
          >
            <Flex d="column" gap={4} ai="flex-start">
              <Box height={14}>
                <Presence present={shown}>
                  {({ ref, props }) => (
                    <Box
                      ref={ref}
                      props={props}
                      px={5}
                      py={3}
                      borderRadius={2}
                      fontSize={14}
                      color="white"
                      bgImage="gradient-primary"
                      transitionDuration={320}
                      startingStyle={{ opacity: 0, translateY: -2 }}
                      dataAttr={{
                        'state=open': { opacity: 1, translateY: 0 },
                        'state=closed': { opacity: 0, translateY: -2 },
                      }}
                    >
                      Both directions, no ternary
                    </Box>
                  )}
                </Presence>
              </Box>
              <Button variant="secondary" onClick={() => setShown((value) => !value)}>
                {shown ? 'Hide' : 'Show'}
              </Button>
            </Flex>
          </Code>

          <Section id="attributes" title="What this library sets for you">
            Two attributes come out of the library itself, and both are documented targets rather than internals:{' '}
            <Mono>data-state="open" | "closed"</Mono> on whatever <Mono>&lt;Presence&gt;</Mono> is holding — which is every layer built on
            it, so <Mono>Tooltip</Mono>, the <Mono>Dropdown</Mono> popup and the DataGrid's column menu all carry it — and{' '}
            <Mono>data-theme</Mono> on the element <Mono>Box.Theme</Mono> writes to. Everything else is yours to set.
          </Section>

          <Section id="invalid" title="A key it cannot parse produces nothing">
            The record key becomes part of a selector, so it is validated before it gets there: an attribute name that is not one, a value
            carrying a quote, an unbalanced <Mono>:has()</Mono>. A key that fails drops its whole block — no rule and no class name, exactly
            what an unmatched prop value does. A typo is invisible rather than a selector nobody wrote, and nothing is ever left carrying a
            class with no rule behind it.
          </Section>
        </Flex>
      </Reveal>
    </Box>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Box id={id}>
      <H2 fontSize={20} fontWeight={600} mb={4} theme={{ dark: { color: 'white' }, light: { color: 'slate-900' } }}>
        {title}
      </H2>
      <Box fontSize={15} lineHeight={26} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-600' } }}>
        {children}
      </Box>
    </Box>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Box
      tag="code"
      display="inline"
      px={1}
      borderRadius={1}
      fontSize={13}
      theme={{ dark: { bgColor: 'slate-800', color: 'slate-200' }, light: { bgColor: 'slate-100', color: 'slate-800' } }}
    >
      {children}
    </Box>
  );
}

const sidebarLinks = [
  { id: 'concept', label: 'What a variant is' },
  { id: 'data', label: 'dataAttr' },
  { id: 'aria', label: 'ariaAttr' },
  { id: 'has', label: 'has' },
  { id: 'not', label: 'not' },
  { id: 'composing', label: 'Composing' },
  { id: 'presence', label: 'Presence + dataAttr' },
  { id: 'attributes', label: 'What the library sets' },
  { id: 'invalid', label: 'An unparseable key' },
];
