if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/HP/.gradle/caches/transforms-4/d6d4bd27d083a4ce058122e0abba5723/transformed/jetified-hermes-android-0.75.5-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/HP/.gradle/caches/transforms-4/d6d4bd27d083a4ce058122e0abba5723/transformed/jetified-hermes-android-0.75.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

