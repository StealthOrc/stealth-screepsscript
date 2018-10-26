// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleCourier = require('role.courier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleLDHarvester = require('role.LDHarvester')

module.exports.loop = function () {
// room W26N11
    Game.spawns['Spawn1'].room.visual.text(
        'Energy: '+Game.spawns['Spawn1'].room.energyAvailable+'/'+Game.spawns['Spawn1'].room.energyCapacityAvailable,
        Game.spawns['Spawn1'].pos.x-2,
        Game.spawns['Spawn1'].pos.y - 1.25,
        {align: 'left', opacity: 0.8});

    var Room = Game.spawns['Spawn1'].room;
    var Position = new RoomPosition(45,0,Room.name);
    Room.visual.text('Next Creep: ', Position.x, Position.y);

    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    for(let spawnName in Game.spawns){
        let spawn = Game.spawns[spawnName];
        spawn.setMinRoles();
    }

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var creepsInRoom = Game.spawns.Spawn1.room.find(FIND_CREEPS);
    var numberMyCreeps = _.sum(Game.creeps);
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
    var numberOfCouriers = _.sum(Game.creeps, (c) => c.memory.role == 'courier');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    //var numLDHarvesterW26N12 = _.sum(Game.creeps, (c) => c.memory.role == 'ldHarvester' && c.memory.target == 'W26N12');
    //var numLDHarvesterW25N11 = _.sum(Game.creeps, (c) => c.memory.role == 'ldHarvester' && c.memory.target == 'W25N11');

    var currEnergy = Game.spawns.Spawn1.room.energyAvailable;
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];
        //NOT NEEDED ONCE CONTAINER MINING IS A THING: if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if(creep.memory.role == 'miner'){
            roleMiner.run(creep, numberOfMiners, numberMyCreeps, currEnergy, energy);
        }
        else if(creep.memory.role == 'courier'){
            roleCourier.run(creep);
        }
        else if(creep.memory.role =='ldHarvester'){
            roleLDHarvester.run(creep);
        }
    }
    var minHarvesters = 2;
    var minUpgraders = 2;
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    var minMiners = sources.length;
    var minCouriers = minMiners;
    var minBuilders = 2;
    var minRepairers = 2;
    //var minLDHarvesterW26N12 = 1;
    //var minLDHarvesterW25N11 = 0;
    //
    // for(let spawnName in Game.spawns){
    //     let spawn = Game.spawns[spawnName];
    //     let minHarvesters = 2;
    //     let minUpgraders = 2;
    //     let sources = spawn.room.find(FIND_SOURCES);
    //     let minMiners = sources.length;
    //     let minCouriers = minMiners;
    //     let minBuilders = 1;
    //     let minRepairers = 1;
    //     let minLDHarvester = 0;
    //     let exits = spawn.room.find(FIND_EXIT);
    //     if(exits.length > 0){
    //         let exitDirections = [FIND_EXIT_BOTTOM,FIND_EXIT_LEFT,FIND_EXIT_TOP,FIND_EXIT_RIGHT];
    //         for(let directionIndex in exitDirections){
    //             if(spawn.room.find(exitDirections[directionIndex]).length > 0){
    //                 minLDHarvester = minLDHarvester+1
    //             }
    //         }
    //     }
    // }
    // setup some minimum numbers for different roles
    var name = undefined;
    var role = undefined;

    //NOT NEEDED ONCE CONTAINERMINING IS A THING: SPAWN HARVESTER
    if (numberOfHarvesters < minHarvesters) {
        role = 'harvester';
        // try to spawn one
        name = Game.spawns.Spawn1.spawnCustomCreep(energy, role);
        // if spawning failed and we have no harvesters left
        console.log(energy);
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.spawnCustomCreep(
                Game.spawns.Spawn1.room.energyAvailable, role);
        }
    }
    // //SPAWN MINER
    else
     if(numberOfMiners < minMiners && numberOfMiners <= numberOfCouriers && energy >= 800){
        role = 'miner';
        for(let spawnName in Game.spawns){
            let spawn = Game.spawns[spawnName];
            for(let source of sources){
                //if there is no creep thats a miner and is assinged to the source and if there is a container
                if(!_.some(creepsInRoom, c => c.memory.role == role && c.memory.sourceID == source.id)){
                    let containers = source.pos.findInRange(FIND_STRUCTURES,1,{
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    });
                    if(containers.length > 0){
                        if(spawn.room.energyAvailable < 800){
                            name = spawn.spawnMiner(source.id, 300, role);
                        }
                        else{
                            name = spawn.spawnMiner(source.id, 800, role);
                        }
                    }
                }
            }
        }
    }
    //SPAWN COURIER
    else if(numberOfCouriers < minCouriers && energy >= 800){
        var role = 'courier';
        for(let spawnName in Game.spawns){
            let spawn = Game.spawns[spawnName];
            let containers = spawn.room.find(FIND_STRUCTURES,{
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
            })
            for(let container of containers){
                //if there is no creep thats a courier and is assinged to the container
                if(!_.some(creepsInRoom, c => c.memory.role == 'courier' && c.memory.containerID == container.id)){
                    if(numberOfCouriers < numberOfMiners && spawn.room.energyAvailable < 800){
                        name = spawn.spawnCourier(container.id,300, role);
                    }
                    else{
                        name = spawn.spawnCourier(container.id,800, role);
                    }
                }
            }
        }
    }
    //SPAWN UPGRADER
    else if (numberOfUpgraders < minUpgraders) {
        role = 'upgrader';
        // try to spawn one
        Game.spawns.Spawn1.spawnCustomCreep(energy, role);
         // Game.spawns.Spawn1.spawnUpgrader();
    }
    //SPAWN BUILDER
    else if (numberOfBuilders < minBuilders) {
        role = 'builder';
        // try to spawn one
        name = Game.spawns.Spawn1.spawnCustomCreep(energy, role);
    }
    //SPAWN REPAIRER
    else if (numberOfRepairers < minRepairers) {
        role = 'repairer';
        // try to spawn one
        name = Game.spawns.Spawn1.spawnCustomCreep(energy, role);
    }
    //SPAWN LONGDISTANCEHARVESTER
    // else if(numLDHarvesterW26N12 < minLDHarvesterW26N12){
    //     role = 'ldHarvester';
    //     name = Game.spawns.Spawn1.spawnLongDistanceHarvester(4,'W26N11','W26N12',0);
    // }
    // else if(numLDHarvesterW25N11 < minLDHarvesterW25N11){
    //     role = 'ldHarvester';
    //     name = Game.spawns.Spawn1.spawnLongDistanceHarvester(4,'W26N11','W25N11',0);
    // }
    // else if(numLDHarvesters < minLDHarvester) {
    //     role = 'ldHarvester'
    //     for(let spawnName in Game.spawns){
    //         let spawn = Game.spawns[spawnName];
    //         let exits = spawn.room.find(FIND_EXIT);
    //         let room = Game.spawns[spawnName].room;
    //         if(exits.length > 0){
    //             let exitDirections = [FIND_EXIT_BOTTOM,FIND_EXIT_LEFT,FIND_EXIT_TOP,FIND_EXIT_RIGHT];
    //             for(let directionIndex in exitDirections){
    //                 if(spawn.room.find(exitDirections[directionIndex]).length > 0 && exitDirections[directionIndex] == FIND_EXIT_BOTTOM){
    //                     var coordsW = room.name.splice(1,2) - 1;
    //                     var coordN = room.name.splice(4,2) - 1;
    //                     var botRoom = room.name;
    //                     botRoom = botRoom.splice(1,0,coordsW);
    //                     botRoom = botRoom.splice(4,0,coordsN);
    //                     console.log('der raum unter mir: '+botRoom);
    //                 }
    //             }
    //         }
    //     }
    //         for(let source of sources){
    //             //if there is no creep thats a miner and is assinged to the source and if there is a container
    //             if(!_.some(creepsInRoom, c => c.memory.role == role && c.memory.sourceID == source.id)){
    //                 let containers = source.pos.findInRange(FIND_STRUCTURES,1,{
    //                     filter: (s) => s.structureType == STRUCTURE_CONTAINER
    //                 });
    //                 if(containers.length > 0){
    //                     name = spawn.createMiner(energy,source.id);
    //                 }
    //             }
    //         }
    //     }
    //
    //     name = spawn.createLongDistanceHarvester(energy,5,spawn.room,targetRoom,source.id)
    // }


    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && name != undefined) {
        console.log("Spawned new creep: " + name);
    }
    // // Debugging text
    // else{
    //     console.log('Error while spawning: '+name);
    // }

    Game.spawns.Spawn1.memory.TicksToWaitForStatus = Game.spawns.Spawn1.memory.TicksToWaitForStatus-1;
    if(Game.spawns.Spawn1.memory.TicksToWaitForStatus <= 0){
        //write to spawn memory
        console.log('Next creep: '+role);
        console.log('Harvesters: '+numberOfHarvesters);
        console.log('Miners:       '+numberOfMiners);
        console.log('Couriers:     '+numberOfCouriers);
        // console.log('LDHarvesterW26N12: '+numLDHarvesterW26N12);
        // console.log('LDHarvesterW25N11: '+numLDHarvesterW25N11);
        console.log('Upgraders:    '+numberOfUpgraders);
        console.log('Builders:     '+numberOfBuilders);
        console.log('Repairers:    '+numberOfRepairers);
        console.log('-------------');
        Game.spawns.Spawn1.memory.TicksToWaitForStatus = 10;
    }
};
