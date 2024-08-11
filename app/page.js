"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemFilter, setItemFilter] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventory = [];
    docs.forEach((doc) => {
      inventory.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventory);
    if (itemFilter === "") {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(({ name }) => name.includes(itemFilter));
      setFilteredInventory(filtered);
    }
  };

  const updateFilter = async (fil) => {
    setItemFilter(fil);

    // update filtered inventory using inventory and fil
    if (fil === "") {
      setFilteredInventory(inventory);
      console.log("Filter updated");
    } else {
      const filtered = inventory.filter(({ name }) => name.includes(fil));
      setFilteredInventory(filtered);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          textTransform="translate(-50%, -50%)"
          width={400}
          bgcolor={"white"}
          border="2px solid black"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        width={"90vw"}
        height={"50px"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button variant="outlined" onClick={handleOpen}>
          Add New Item
        </Button>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography>Filter:&emsp;</Typography>
          <TextField
            variant="outlined"
            value={itemFilter}
            onChange={(e) => {
              updateFilter(e.target.value);
            }}
            size="small"
          />
        </Box>
      </Box>

      <Box width={"90vw"}>
        <Box
          height={"100px"}
          display={"flex"}
          bgcolor={"#ADD8E6"}
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius={"10px"}
          m="5px"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Box py="7px">
          <Stack
            height={"40vh"}
            spacing={1}
            overflow={"auto"}
            alignItems={"center"}
            borderRadius={"10px"}
            mx="10px"
          >
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width={"100%"}
                minHeight={"70px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                borderRadius={"10px"}
                bgcolor={"#f0f0f0"}
                p={2}
              >
                <Typography variant="h3" color={"#333"} textAlign={"left"} width={'40%'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color={"#333"} textAlign={"right"} width='40%'>
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    removeItem(name);
                  }}
                  width='20%'
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
