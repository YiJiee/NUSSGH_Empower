import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/reduxInit';
import CodePush from 'react-native-code-push';
//component
import AppRoot from './screens/appRoot';
import LoadingScreen from './components/account/initLoadingScreen';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finishLoading: false
    }
  }

  componentDidMount() {
    CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME}, this.syncWithCodePush, null);
  }

  syncWithCodePush = (status) => {
    console.log('sync with code push : ' + status);
  }

  render() {
    const {finishLoading} = this.state;
    return (
        <Provider store={store}>
          {finishLoading ? (
              <AppRoot />
          ) : (
              <LoadingScreen finishHandler={() => this.setState({finishLoading: true})} />
          )}
        </Provider>
    );
  }
}
