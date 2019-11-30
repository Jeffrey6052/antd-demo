import React from 'react'
import { action } from '@storybook/addon-actions'

import '../src/App.css';

import ButtonPage from '../src/pages/Button'

import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

storiesOf('ButtonPage', module)
  .addDecorator(StoryRouter())
  .add('jeffrey', () => (
    <ButtonPage title="jeffrey" onDownloadClick={action('download click')} />
  ))
  .add('peter', () => (
    <ButtonPage title="peter" onDownloadClick={action('download click')} />
  ))
  .add("demo", () => (
    <div>demo</div>
  ))
