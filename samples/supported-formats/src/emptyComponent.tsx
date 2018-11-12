import * as React from 'react';
export interface EmptyComponentProps  {
  initialToggleState: boolean
}
export interface EmptyComponentState {
  toggle: boolean
}

export class EmptyComponent extends React.Component<EmptyComponentProps, EmptyComponentState> {

  state: EmptyComponentState = {
    toggle: true
  }

  constructor(props: EmptyComponentProps, state: EmptyComponentState) {
    super(props, state)
  }

  render(): React.ReactNode {
    return (
      <div  >
        <button onClick={e => this.setState({ toggle: !this.state.toggle })}>
          {this.state.toggle ? 'ON' : 'OFF'}
        </button>
      </div>
    )
  }
}
