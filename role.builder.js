var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            var csContainer = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{filter: (s) => s.structureType == STRUCTURE_CONTAINER});
            if( csContainer != undefined){
                // try to build, if the constructionSite is not in range
                if (creep.build(csContainer) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(csContainer,{visualizePathStyle: {stroke: '#f7ff00'}});
                }
            }
            else if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite,{visualizePathStyle: {stroke: '#f7ff00'}});
                }
            }
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (s) => (
                   (s.structureType == STRUCTURE_CONTAINER && (s.store[RESOURCE_ENERGY] >= creep.carryCapacity || s.store[RESOURCE_ENERGY] == s.storeCapacity))
                || ((s.structureType == STRUCTURE_EXTENSION) && (s.energy >= creep.carryCapacity || s.energy == s.energyCapacity))
            )})
            // console.log('build:creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE):'+creep.withdraw(structure,RESOURCE_ENERGY));
            if (structure == null || (creep.withdraw(structure,RESOURCE_ENERGY) != ERR_NOT_IN_RANGE))
            {
                structure = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(structure) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(structure);
                }
            }
            else
            {
                if(creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(structure);
                }
            }
        }
    }
};
