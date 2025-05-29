// import React from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// interface DownloadProgressModalProps {
//   visible: boolean;
//   progress: number;
//   isDownloading: boolean;
//   onClose: () => void;
// }

// const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
//   visible,
//   progress,
//   isDownloading,
//   onClose,
// }) => {
//   return (
//     <Modal transparent visible={visible} animationType="fade">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Đang tải bài hát...</Text>
//           <View style={styles.progressBarBackground}>
//             <View
//               style={[
//                 styles.progressBarFill,
//                 { width: `${progress}%` },
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText}>{progress}%</Text>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => {
//               if (!isDownloading) onClose();
//             }}>
//             <Text style={styles.closeButtonText}>Đóng</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     width: '80%',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   progressBarBackground: {
//     width: '100%',
//     height: 10,
//     backgroundColor: '#ccc',
//     borderRadius: 5,
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#007BFF',
//   },
//   progressText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   closeButton: {
//     marginTop: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default DownloadProgressModal;
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather'; // icon download

interface DownloadProgressModalProps {
  visible: boolean;
  progress: number;
  isDownloading: boolean;
  onClose: () => void;
}

const SIZE = 100;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  visible,
  progress,
  isDownloading,
  onClose,
}) => {
  const strokeDashoffset =
    CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Đang tải bài hát...</Text>
          <View style={styles.circleWrapper}>
            <Svg width={SIZE} height={SIZE}>
              <Circle
                stroke="#ccc"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE_WIDTH}
              />
              <Circle
                stroke="#007BFF"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
            </Svg>
            <View style={styles.iconContainer}>
              <Icon name="download" size={30} color="#007BFF" />
            </View>
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
          <TouchableOpacity
            style={[
              styles.closeButton,
              isDownloading && { backgroundColor: '#999' },
            ]}
            disabled={isDownloading}
            onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  circleWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DownloadProgressModal;
