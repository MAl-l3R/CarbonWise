import React, { useRef, useEffect, useState, ReactNode } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutRectangle,
} from 'react-native';

interface DropdownMenuProps {
  visible: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  trigger: ReactNode;
  children: ReactNode;
  dropdownWidth?: number;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  handleOpen,
  handleClose,
  trigger,
  children,
  dropdownWidth = 150,
}) => {
  const triggerRef = useRef<View>(null);
  const [position, setPosition] = useState<
    LayoutRectangle & { pageX: number; pageY: number }
  >({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });

  useEffect(() => {
    if (triggerRef.current && visible) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({
          x: fx,
          y: fy,
          width,
          height,
          pageX: px,
          pageY: py,
        });
      });
    }
  }, [visible]);

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleOpen}>
        <View ref={triggerRef}>{trigger}</View>
      </TouchableWithoutFeedback>
      {visible && (
        <Modal
          transparent
          visible={visible}
          animationType="fade"
          onRequestClose={handleClose}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.menu,
                  {
                    top: position.pageY + position.height,
                    left:
                      position.pageX +
                      position.width / 2 -
                      dropdownWidth / 2,
                    width: dropdownWidth,
                  },
                ]}
              >
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 6,


    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 4,
  },
});
