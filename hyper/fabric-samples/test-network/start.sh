./network.sh down
./network.sh up createChannel -c blockchain2023 -ca
./network.sh deployCC -ccn blockchain -ccl typescript -ccv 1.0 -ccs 1 -ccp ../chaincode -cci initLedger