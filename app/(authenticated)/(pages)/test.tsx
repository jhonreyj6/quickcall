import React, { useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Test() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const MENU_WIDTH = 140;
  const MENU_HEIGHT = 100;

  const handleLongPress = (event) => {
    const { pageX, pageY } = event.nativeEvent;

    // SAFE boundaries
    let x = pageX;
    let y = pageY;

    // clamp X
    if (x + MENU_WIDTH > SCREEN_WIDTH) {
      x = SCREEN_WIDTH - MENU_WIDTH - 10;
    }
    if (x < 10) {
      x = 10;
    }

    // clamp Y
    if (y + MENU_HEIGHT > SCREEN_HEIGHT) {
      y = SCREEN_HEIGHT - MENU_HEIGHT - 10;
    }
    if (y < 10) {
      y = 10;
    }

    setMenuPos({ x, y });
    setMenuVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable onLongPress={handleLongPress} style={{ flex: 1, backgroundColor: "#eee" }}>
        <Text style={{ marginTop: 40, textAlign: "center" }}>Long press anywhere</Text>
      </Pressable>

      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View
            style={[
              styles.menu,
              {
                top: menuPos.y,
                left: menuPos.x,
                width: MENU_WIDTH,
              },
            ]}
          >
            <Pressable style={styles.menuButton}>
              <Text style={styles.menuText}>Edit</Text>
            </Pressable>

            <Pressable style={[styles.menuButton, styles.delete]}>
              <Text style={[styles.menuText, { color: "white" }]}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  menuButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  delete: {
    backgroundColor: "red",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
