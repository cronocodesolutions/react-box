import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Label from './label';

describe('useStyles', () => {
  //
  it('generates label tag item', () => {
    render(<Label>my label</Label>);

    const label = screen.getByText('my label');

    expect(label).toBeDefined();
    expect(label.tagName).to.equal('LABEL');
  });
});
