import { useState } from 'react';
import {
    FiCheck,
    FiCoffee,
    FiGlobe,
    FiInstagram,
    FiSettings,
} from 'react-icons/fi';
import { Modal, ModalBody } from 'flowbite-react';
import { User } from '../../types';

interface ProfileInfoProps {
    user: User;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const props = { openModal, setOpenModal };

    return (
        <>
            {/* Links */}
            <div className="flex justify-between items-center mb-5 text-gray-200">
                <button type="button" onClick={() => props.setOpenModal('pop-up')}>
                    <FiGlobe className="w-5 h-5" />
                </button>
                <div className="flex gap-4">
                    <button type="button" onClick={() => props.setOpenModal('pop-up')}>
                        <FiInstagram className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => props.setOpenModal('pop-up')}>
                        <FiSettings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-white">
                        <h1 className="text-xl uppercase mb-1">
                            {`${user.first_name} ${user.last_name}`}
                        </h1>
                        <div className="text-gray-300 flex items-center gap-2">
                            <p className="text-xs">{user.username}</p>
                        </div>
                    </div>
                    <img
                        src={user.avatar}
                        width="45"
                        height={45}
                        className="rounded-full"
                        alt={`${user.username}'s avatar`}
                    />
                </div>
                <p className="text-xs text-gray-300">{'No bio added yet'}</p>
            </div>

            {/* Modal */}
            <Modal
                show={props.openModal === 'pop-up'}
                size="sm"
                popup
                position="center"
                onClose={() => props.setOpenModal(undefined)}
                dismissible
            >
                <ModalBody className="pt-6 bg-[#000] flex justify-center items-center rounded-md">
                    <div className="text-center">
                        <FiCoffee className="mx-auto mb-4 h-14 w-14 text-green-500" />
                        <h3 className="mb-5 text-lg font-normal text-gray-200">
                            Feature coming soon
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => props.setOpenModal(undefined)}
                                className="border border-[#333] text-sm px-8 py-1.5 rounded-lg flex justify-center items-center"
                            >
                                Ok, cool <FiCheck className="text-green-500 ml-2 text-lg" />
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ProfileInfo;
