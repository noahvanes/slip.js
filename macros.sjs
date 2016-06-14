macro define {
     rule { $nam $val } =>
        { macro $nam {
           rule {} => {$val}
          }
        }
}

macro defineGlobal {
     rule { $nam $val } =>
        { define $nam $val
          export $nam
        }
}

export define

/* global application constants */

defineGlobal __GLOBAL_SIZ__ 256

/* -- POINTER STRUCTURES -- */
defineGlobal __PAI_TAG__ 0x00
defineGlobal __VCT_TAG__ 0x02
defineGlobal __PRC_TAG__ 0x04
defineGlobal __SEQ_TAG__ 0x06
defineGlobal __IFS_TAG__ 0x08
defineGlobal __IFF_TAG__ 0x0A
defineGlobal __DFV_TAG__ 0x0C
defineGlobal __DFF_TAG__ 0x0E
defineGlobal __SLC_TAG__ 0x10
defineGlobal __LMB_TAG__ 0x12
defineGlobal __SGL_TAG__ 0x14
defineGlobal __QUO_TAG__ 0x16
defineGlobal __CNT_TAG__ 0x18
defineGlobal __BND_TAG__ 0x1A
//available: __XXX_TAG__ 0x1C
defineGlobal __DFZ_TAG__ 0x1E
defineGlobal __THK_TAG__ 0x20
defineGlobal __LMZ_TAG__ 0x22
defineGlobal __PRZ_TAG__ 0x24
defineGlobal __TTK_TAG__ 0x26
defineGlobal __APL_TAG__ 0x28
defineGlobal __TPL_TAG__ 0x2A
defineGlobal __TPZ_TAG__ 0x2C
defineGlobal __APZ_TAG__ 0x2E
defineGlobal __ALL_TAG__ 0x30
defineGlobal __TLL_TAG__ 0x32
defineGlobal __AGL_TAG__ 0x34
defineGlobal __TGL_TAG__ 0x36
defineGlobal __STL_TAG__ 0x38
defineGlobal __ANL_TAG__ 0x3A
defineGlobal __TNL_TAG__ 0x3C
defineGlobal __PRT_TAG__ 0x3E

/* -- RAW CHUNKS -- */
defineGlobal __FLT_TAG__ 0x01
defineGlobal __SYM_TAG__ 0x03
defineGlobal __STR_TAG__ 0x05
defineGlobal __TGZ_TAG__ 0x07
defineGlobal __AGZ_TAG__ 0x09
defineGlobal __ALZ_TAG__ 0x0B
defineGlobal __TLZ_TAG__ 0x0D
defineGlobal __NLC_TAG__ 0x0F
defineGlobal __ANZ_TAG__ 0x11
defineGlobal __TNZ_TAG__ 0x13

/* -- IMMEDIATES -- */
//(tags > maxTag = 0x3f)
defineGlobal __CHR_TAG__ 0x40
defineGlobal __TRU_TAG__ 0x41
defineGlobal __FLS_TAG__ 0x42
defineGlobal __VOI_TAG__ 0x43
defineGlobal __NUL_TAG__ 0x44
defineGlobal __NBR_TAG__ 0x45
defineGlobal __NAT_TAG__ 0x46
defineGlobal __LCL_TAG__ 0x47
defineGlobal __GLB_TAG__ 0x48