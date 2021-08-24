import React from 'react';
import { Grid, Header, Container } from 'semantic-ui-react';

export default function AppHeader() {
  return <Container>
    <Grid>
      <Grid.Column>
        <Header size="large">Flashcards</Header>
      </Grid.Column>
    </Grid>
  </Container>
}