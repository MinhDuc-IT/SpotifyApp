import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type BackButtonType = {
    onPress: () => void;
}

const BackButton = ({ onPress }: BackButtonType) => {
    const [buttonColor, setButtonColor] = useState('#121212');
    const [iconColor, setIconColor] = useState('#777777');
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ padding: 20, backgroundColor: '#121212' }}
            activeOpacity={1}
        >
            <Ionicons name="arrow-back" size={24} color="#777777" />
        </TouchableOpacity>
    );
};

export default BackButton;
