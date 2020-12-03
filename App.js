import React from 'react';
import Modal from 'react-native-modal';
import {Provider} from 'react-redux';
import {store} from './redux/reduxInit';
import CodePush from 'react-native-code-push';
//component
import AppRoot from './screens/appRoot';
import LoadingScreen from './components/account/initLoadingScreen';
import UpdateInfo from './components/updateInfo/updateInfo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finishLoading: false,
      showUpdateAppInfo: false,
    }
  }

  componentDidMount() {
    CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME}, this.syncWithCodePush, this.codePushDownloadDidProgress);
  }

  syncWithCodePush = (status) => {
    console.log('sync with code push : ' + status);
  }

  codePushDownloadDidProgress = (progress) => {
    console.log('Download Progress : ' + progress);
    let currProgress = 100 * parseFloat(
        progress.receivedBytes / progress.totalBytes
    ).toFixed(2);
    this.setState({downloadProgress: currProgress});
    if (currProgress >= 100) {
      this.setState({showUpdateAppInfo: true});
    }
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

          <Modal
              isVisible={this.state.showUpdateAppInfo}
              transparent={true}
              animationType='fade'
              onRequestClose={() => this.setState({showUpdateAppInfo : false})}>

              <UpdateInfo closeModal={() => this.setState({showUpdateAppInfo : false})}/>

          </Modal>

        </Provider>
    );
  }
}

