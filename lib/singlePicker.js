import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    PickerIOS,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    Dimensions,
} from 'react-native';

import PickerAndroid, { PickerItemAndroid } from './androidPicker';

let _Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let _PickerItem = Platform.OS === 'ios' ? _Picker.Item : PickerItemAndroid;

export default class SinglePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options,
            modalVisible: false,
            selectedOption: this.props.options.filter((op) => op.key === this.props.defaultSelectedValue)[0] || {},
        };
    }

    static propTypes = {
        options: PropTypes.array.isRequired,
        defaultSelectedValue: PropTypes.any,
        onConfirm: PropTypes.func,
        onSelect: PropTypes.func,
        onCancel: PropTypes.func,
        lang: PropTypes.string,
        style: PropTypes.object,
        buttonCancelStyle: PropTypes.any,
        buttonAcceptStyle: PropTypes.any,
        buttonAcceptText: PropTypes.string,
        buttonCancelText: PropTypes.string,
        headerStyle: PropTypes.any,
    };

    static defaultProps = {
        lang: 'zh-CN',
        style: { backgroundColor: 'white' },
        onConfirm: () => {
        },
        onSelect: () => {
        },
        onCancel: () => {
        },
        setOption: () => {
        },
    };

    show() {
        this.setState(Object.assign({}, this.state, { modalVisible: true }));
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    setOption(options, defaultSelectedValue) {
        this.setState(Object.assign({}, this.state, {
            options: options,
            selectedOption: options.filter((op) => op.key === defaultSelectedValue)[0] || {},
        }));
    }

    render() {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => {
                }}
                visible={this.state.modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.hide()}>
                    <View style={styles.basicContainer}>
                        <View style={[
                            styles.modalContainer, this.props.style, {
                                width: Dimensions.get('window').width,
                            },
                        ]}>
                            <View style={{ backgroundColor: '#CACACA', height: 0.5, width: Dimensions.get('window').width }}/>
                            <View style={[
                                styles.buttonView, this.props.headerStyle, {
                                    width: Dimensions.get('window').width,
                                },
                            ]}>
                                <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={() => {
                                    this.props.onCancel();
                                    this.setState({ modalVisible: false });
                                }}>
                                    <Text
                                        style={this.props.buttonCancelStyle}>{this.props.buttonCancelText ? this.props.buttonCancelText : 'Cancel'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={() => {
                                    if (this.props.onConfirm) {
                                        if (!this.state.selectedOption.key && this.state.selectedOption.key !== 0) {
                                            let submitData = this.state.options[0] || {};
                                            if (!submitData && this.state.defaultSelectedValue) {
                                                submitData = this.state.options.filter((op) => op.key === this.state.defaultSelectedValue)[0];
                                            }
                                            this.props.onConfirm(submitData);
                                        } else {
                                            this.props.onConfirm(this.state.selectedOption);
                                        }
                                    }
                                    this.setState({ modalVisible: false });
                                }}>
                                    <Text
                                        style={this.props.buttonAcceptStyle}>{this.props.buttonAcceptText ? this.props.buttonAcceptText : 'Select'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: '#CACACA', height: 0.5, width: Dimensions.get('window').width }}/>
                            <View style={styles.mainBox}>
                                <_Picker
                                    ref={'picker'}
                                    style={[
                                        styles.bottomPicker, {
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height / 4 * 1,
                                        },
                                    ]}
                                    selectedValue={(this.state.selectedOption.key || this.state.selectedOption === 0) ? this.state.selectedOption.key : this.state.defaultSelectedValue}
                                    onValueChange={val => {
                                        let curOption = this.state.options.filter((op) => op.key === val)[0];
                                        this.props.onSelect(curOption);
                                        this.setState(
                                            Object.assign({}, this.state, { selectedOption: curOption }));
                                    }}>
                                    {this.state.options.map((option, i) => {
                                        return (
                                            <_PickerItem
                                                key={i}
                                                value={option.key}
                                                label={option.value}
                                            />
                                        );
                                    })}
                                </_Picker>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
            ;
    }
}

var styles = StyleSheet.create({
    basicContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    buttonView: {
        height: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    bottomPicker: {},
    mainBox: {},
    button: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonLeft: {
        justifyContent: 'flex-start',
    },
    buttonRight: {
        justifyContent: 'flex-end',
    },
});
