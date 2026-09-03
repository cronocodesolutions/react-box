import Box from '@box-kite/react';

/**
 * An async Server Component behind a Suspense boundary — the case that made runtime CSS-in-JS awkward. Its
 * markup arrives in a later chunk of the same response, and so do its `<style>` elements, which React
 * appends to what it already hoisted. Nothing waits for a commit, because nothing here needs one.
 */

const releases = [
  ['CO3', 'StyleSink', 'The one emission path every mode plugs into'],
  ['CO4', 'Flush scheduler', 'When rules reach the sink, as injectable policy'],
  ['D1', 'Element mode', 'Rules as <style href precedence>, hoisted by React'],
  ['CO6', 'Vanilla core', 'The same engine with no framework at all'],
];

async function slowRows() {
  // Stands in for the database call every real page has behind its Suspense boundary.
  await new Promise((resolve) => setTimeout(resolve, 700));

  return releases;
}

export function StreamedFallback() {
  return (
    <Box p={6} borderRadius={3} b={1} borderColor="slate-200" theme={{ dark: { borderColor: 'slate-800' } }}>
      <Box fontSize={14} color="slate-500">
        Streaming the slow section…
      </Box>
    </Box>
  );
}

export default async function StreamedSection() {
  const rows = await slowRows();

  return (
    <Box p={6} borderRadius={3} b={1} borderColor="emerald-500" theme={{ dark: { borderColor: 'emerald-500' } }} md={{ p: 8 }}>
      <Box tag="h2" fontSize={18} fontWeight={600}>
        Streamed after a 700ms await
      </Box>
      <Box tag="p" mt={2} fontSize={14} color="slate-600" theme={{ dark: { color: 'slate-400' } }}>
        This block and its CSS arrived in a later chunk of the same HTML response.
      </Box>
      <Box mt={5} display="flex" d="column" gap={2}>
        {rows.map(([id, title, note]) => (
          <Box
            key={id}
            display="flex"
            ai="center"
            gap={3}
            p={3}
            borderRadius={2}
            bgColor="emerald-50"
            theme={{ dark: { bgColor: 'slate-900' } }}
          >
            <Box
              px={2}
              py={1}
              borderRadius={1}
              fontSize={12}
              fontWeight={600}
              bgColor="emerald-500"
              color="white"
              minWidth={12}
              textAlign="center"
            >
              {id}
            </Box>
            <Box fontSize={14} fontWeight={600}>
              {title}
            </Box>
            <Box fontSize={14} color="slate-500">
              {note}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
