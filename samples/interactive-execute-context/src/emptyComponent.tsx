import * as React from 'react';

export interface EmptyComponentProps {
}
export interface EmptyComponentState {
}

export class EmptyComponent extends React.Component<EmptyComponentProps, EmptyComponentState> {

  state: EmptyComponentState = {
  }

  constructor(props: EmptyComponentProps, state: EmptyComponentState) {
    super(props, state)
  }

  render(): React.ReactNode {
    return (
      <div  >

      </div>
    )
  }
}
